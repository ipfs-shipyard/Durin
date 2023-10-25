package ai.protocol.ipfs.filforge

import android.content.Context
import android.net.Uri
import android.util.Log
import io.ipfs.cid.Cid
import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.coroutineScope

const val TEST_CID = "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A"
const val HOT_TIME_DISCOUNT: Long = 1000
const val HTTP_REQUEST_TIMEOUT: Long = 30_000

/**
 * Data class representing a node with its attributes.
 *
 * @property host The hostname of the node.
 * @property healthy Indicates if the node is healthy.
 * @property remote Indicates if the node is remote.
 * @property hot Indicates if the node is hot.
 * @property port The port of the node. Can be null.
 * @property speed The speed of the node. Can be null.
 */
data class Node(
    val host: String,
    val healthy: Boolean = true,
    val remote: Boolean = true,
    val hot: Boolean = false,
    val port: Int? = null,
    val speed: Long? = null
)

/** List of default nodes. */
val defaultNodeList: List<Node> = listOf(
    Node(host = "w3s.link", hot = true),
    Node(host = "dweb.link"),
    Node(host = "cf-ipfs.com"),
    Node(host = "4everland.io"),
    Node(host = "gw3.io"),
    Node(host = "storry.tv"),
    Node(host = "nftstorage.link", hot = true)
)

/** Callback type for nodeCheck. */
typealias NodeCheckCallback = (List<Node>) -> Unit

/** List of nodes. */
var nodeList: List<Node> = emptyList()


/**
 * Retrieves the fastest healthy node from the nodeList.
 *
 * This function filters out unhealthy nodes and then sorts the remaining nodes based on their speed in ascending order.
 * The node with the smallest speed value (i.e., fastest) is then returned.
 *
 * @return The fastest healthy node.
 * @throws Exception if there are no healthy nodes in the nodeList.
 */
fun getFastestNode() : Node {
    val sortedHealthyNodes = nodeList.filter { it.healthy }.sortedBy { it.speed }
    if (sortedHealthyNodes.isNotEmpty())
        return sortedHealthyNodes[0]

    throw Exception("No healthy nodes found!")
}

/**
 * Initiates a health check on a predefined list of nodes to update their status.
 * Utilizes parallel processing to expedite the health check process.
 */
suspend fun nodeCheck(callback: NodeCheckCallback? = null) {
    val client = HttpClient {
        install(HttpTimeout) {
            requestTimeoutMillis = HTTP_REQUEST_TIMEOUT
        }
    }

    nodeList = defaultNodeList.pmap {
        healthCheck(client, it)
    }

    client.close()

    // exec callback if provided
    callback?.invoke(nodeList)
}

/**
 * A parallel map function that applies a transform function to each element of the given Iterable
 * in a concurrent manner, returning a new list with the transformed elements.
 *
 * @param transform The transform function to be applied to each element of the given Iterable.
 * @return A new list with the transformed elements.
 */
suspend fun <A, B> Iterable<A>.pmap(transform: suspend (A) -> B): List<B> {
    return coroutineScope {
        map {
            async {
                transform(it)
            }
        }.awaitAll()
    }
}

/**
 * Performs a health check on a given node to measure its healthiness and speed.
 * The healthiness is determined based on the HTTP response status and the speed is
 * measured based on the time taken to process a sample HTTP request.
 *
 * @param client The [HttpClient] to use for the request.
 * @param node The node to be checked.
 * @return A new Node instance with updated healthiness and speed attributes.
 */
suspend fun healthCheck(client: HttpClient, node: Node): Node {
    var nodeHealthy = true
    val start: Long = System.currentTimeMillis()

    try {
        val transformedUrl = transform("ipfs://$TEST_CID?now=" + System.currentTimeMillis(), node)
        val response: HttpResponse = client.get(transformedUrl)
        if (response.status.value != 200) {
            nodeHealthy = false
        }
    } catch (e: Exception) {
        nodeHealthy = false
        Log.w(LOG_TAG, "health check failed!", e)
    }

    var nodeSpeed = System.currentTimeMillis() - start
    if (node.hot) nodeSpeed -= HOT_TIME_DISCOUNT

    return node.copy(healthy = nodeHealthy, speed = nodeSpeed)
}

/**
 * Transforms a given input URL into a standardized format based on several conditions
 * and a provided [Node] object. This function handles different scenarios like HTTP
 * URLs, IPFS and IPNS protocols, and certain URL anomalies.
 *
 * @param inputUrl The input URL as a [String] to be transformed.
 * @param node The [Node] object which contains details for transforming the URL.
 * @return A [String] representing the transformed URL.
 *
 * @throws Exception if the URL transformation fails due to unsupported protocol or other issues.
 *
 * Example Usage:
 * ```kotlin
 * val node = Node(...)
 * val transformedUrl = transform("ipfs://bafybe...?arg=value", node)
 * ```
 *
 * This function does the following transformations:
 * 1. If the input URL is an HTTP/HTTPS URL, it's returned as-is.
 * 2. If the input URL is a valid CID, it prepends "ipfs://" to the URL.
 * 3. If the input URL does not start with "ipfs:" or "ipns:", it assumes "ipns://" as the protocol.
 * 4. It corrects a known bug affecting the hostname and pathname parsing in Android.
 * 5. It corrects the loss of case sensitivity for v0 CIDs.
 * 6. It constructs the final URL based on the node's host, port, and remote properties,
 *    and the protocol of the input URL.
 */
fun transform(inputUrl : String, node: Node) : String {

    // catch HTTP urls and pass them straight back
    try {
        if (Uri.parse(inputUrl).scheme!!.startsWith("http"))
            return inputUrl
    } catch (ignored : Exception) {  }

    var outputUrl : String = inputUrl

    // support opening just a CID w/ no protocol
    if (isCID(inputUrl) || isCID(inputUrl.split('/')[0].split('?')[0])) {
        outputUrl = "ipfs://$inputUrl"
    }
    // no protocol, not a CID - assume IPNS
    else if (!inputUrl.startsWith("ipfs://") && !inputUrl.startsWith("ipns://")) {
        outputUrl = "ipns://$inputUrl"
    }

    // trim trailing /
    outputUrl = outputUrl.removeSuffix("/")

    val urlObject = java.net.URI(outputUrl)
    val protocol = urlObject.scheme
    var hostname = urlObject.host
    var pathname = urlObject.path
    val search = urlObject.query

    // There's a bug in URL that causes hostname and pathname to be confused on Android (ok on iOS)
    // Specifically, hostname is empty and path name has the format "//hostname/pathname"
    if (hostname.isEmpty() && pathname.isNotEmpty()) {
        val matchResult = Regex("""^//([^/]+)(/?.*)$""").find(pathname)
        if (matchResult != null) {
            val (matchedHostname, matchedPathname) = matchResult.destructured
            hostname = matchedHostname
            pathname = matchedPathname
        }
    }

    // v0 CID, fix loss of case sensitivity
    if (hostname.startsWith("qm", ignoreCase = true)) {
        val regex = Regex(hostname, RegexOption.IGNORE_CASE)
        val matchResult = regex.find(outputUrl)
        matchResult?.let {
            val start = it.range.first
            hostname = outputUrl.substring(start, start + hostname.length)
        }
    }

    val nodeHost = node.port?.let { "${node.host}:$it" } ?: node.host
    val nodeProtocol = if (node.remote) "https" else "http"

    if (protocol == "ipfs") {
        // When origin-based security is needed, a CIDv1 in a case-insensitive
        // encoding such as Base32 or Base36 should be used in the subdomain:
        // ex: https://<cidv1b32>.ipfs.<gateway-host>.tld/path/to/resource
        if (node.remote && isBase32EncodedMultibase(hostname)) {
            return "$nodeProtocol://$hostname.ipfs.$nodeHost$pathname".withQueryParams(search)
        }

        return "$nodeProtocol://$nodeHost/ipfs/$hostname$pathname".withQueryParams(search)
    }

    if (protocol == "ipns") {
        return "$nodeProtocol://$nodeHost/ipns/$hostname$pathname".withQueryParams(search)
    }

    throw Exception("Failed to transform URL: $inputUrl")
}


/**
 * Checks if the given string is a valid Content Identifier (CID).
 *
 * This function attempts to decode the given string as a CID.
 * If decoding is successful, it returns `true`, otherwise `false`.
 * Any exception thrown during decoding is caught and logged, and `false` is returned.
 *
 * @param cid The string to be checked.
 * @return `true` if [cid] is a valid CID, `false` otherwise.
 */
 fun isCID(cid : String):Boolean {
    return try {
        Cid.decode(cid)
        true
    } catch (e : Exception) {
        false
    }
}

/**
 * Checks if the given CID (Content Identifier) is Base32 encoded and multibase prefixed.
 *
 * This function tries to decode the provided CID and then Base32 decodes the result.
 * If any of these operations fail, the function returns false. Otherwise, it returns true.
 *
 * @param inputCid The Content Identifier (CID) to be checked.
 * @return true if the `inputCid` is Base32 encoded and multibase prefixed, false otherwise.
 */
fun isBase32EncodedMultibase(inputCid : String) : Boolean {
    return try {
        val cid = Cid.decode(inputCid)
        (cid.version == 1L)
    }
    catch(ignored : Exception) {
        false
    }
}

fun String.withQueryParams(queryParams: String?): String {
    return if (queryParams.isNullOrEmpty()) {
        this
    } else {
        "$this?$queryParams"
    }
}

/**
 * get the preferred gateway to use
 */
fun getPreferredGateway(context : Context) : String? {
    return context.getSharedPreferences("ai.protocol.ipfs.filforge", Context.MODE_PRIVATE).getString(KEY_PREFERRED_GATEWAY, "auto")
}

/**
 * Set the preferred gateway to use
 */
fun setPreferredGateway(context : Context, gateway : String) {
    context.getSharedPreferences("ai.protocol.ipfs.filforge", Context.MODE_PRIVATE).edit().putString(KEY_PREFERRED_GATEWAY, gateway).apply()
}
