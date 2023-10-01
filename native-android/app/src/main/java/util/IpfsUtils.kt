package util

import ai.protocol.ipfs.filforge.LOG_TAG
import android.net.Uri
import android.util.Log
import io.ipfs.cid.Cid
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import org.apache.commons.codec.binary.Base32


const val TEST_CID : String = "bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354"
const val HOT_TIME_DISCOUNT : Long = 1000

// node definition
data class Node(
    val host: String,
    val port: Int? = null,
    val remote: Boolean,
    var healthy: Boolean,
    var speed: Int? = null,
    var hot: Boolean = false
)

suspend fun updateNodeStatus(node : Node) {
    healthCheck(node, node.hot)
}

/**
 * Performs a health check on a specified [Node] and updates its health and speed attributes accordingly.
 *
 * This function creates an HTTP client, sends a GET request to a transformed URL, and evaluates the response
 * to determine the health of the node. If the response status is not 200, the node is marked as unhealthy.
 * Additionally, the function computes the elapsed time for the request and adjusts it if the [hot] parameter is true,
 * reflecting a prioritization for hot gateways due to their consistency.
 *
 * @param node The [Node] object representing the node to be checked.
 * @param hot A [Boolean] flag indicating whether the node is considered hot (true) or not (false).
 */
suspend fun healthCheck(node : Node, hot : Boolean) {
    val start : Long = System.currentTimeMillis()
    val transformedUrl = transform("ipfs://$TEST_CID?now=" + System.currentTimeMillis(), node)
    val client = HttpClient()
    val response: HttpResponse = client.get(transformedUrl)
    if (response.status.value != 200) {
        node.healthy = false
    }
    client.close()
    var elapsed = System.currentTimeMillis() - start
    if (hot)
        elapsed -= HOT_TIME_DISCOUNT // priortize hot gateways as they are more consistent
    node.speed
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
    } catch (ignored : Exception) {}


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

    val urlObject = java.net.URL(outputUrl)
    val protocol = urlObject.protocol
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

    if (protocol == "ipfs:") {
        if (node.remote && isBase32EncodedMultibase(hostname))
            return "$nodeProtocol://$hostname.ipfs.$nodeHost$pathname$search"

        return "$nodeProtocol://$nodeHost/ipfs/$hostname$pathname$search"
    }

    if (protocol == "ipns:") {
        return "$nodeProtocol://$nodeHost/ipns/$hostname$pathname$search"
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
        Log.e(LOG_TAG, "Error parsing CID: ", e)
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
fun isBase32EncodedMultibase(inputCid : String): Boolean {
    try {
        val cid = Cid.decode(inputCid)
        Base32().decode(cid.toString())
    }
    catch(ignored : Exception) {
        return false
    }

    return true
}

