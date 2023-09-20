/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react'
import { Zeroconf, ZeroconfResult } from '@awesome-cordova-plugins/zeroconf'
import pMap from 'p-map'
import { uniqBy, orderBy } from 'lodash'
import memo from 'moize'
import EventEmitter from 'eventemitter3'
import createPersistedState from 'use-persisted-state'
import { cid, base32cid } from 'is-ipfs'

const MAX_CHECK_INTERVAL = 10000
// QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn is used for health checking: https://github.com/ipfs/go-ipfs/pull/8429/files
const TEST_CID = 'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354'

export type Node = {
  host: string
  port?: number
  remote: boolean
  healthy: boolean
  speed?: number
  hot?: boolean
}

export type SettingsObject = {
  node: string
}

export const transform = (url: string, node: Node) => {
  // support opening just a CID w/ no protocol
  if (cid(url) || cid(url.split('/')[0].split('?')[0])) url = `ipfs://${url}`

  // catch HTTP urls
  try {
    if (new URL(url).protocol.startsWith('http')) return url
  } catch (_e) {}

  // no protocol, not a CID - assume IPNS
  if (!url.startsWith('ipfs://') && !url.startsWith('ipns://')) url = `ipns://${url}`

  // trim trailing /
  if (url.endsWith('/')) url = url.slice(0, -1)

  let { protocol, hostname, pathname, search } = new URL(url)

  // there's a bug in URL that causes hostname and pathname to be confused on Android (ok on iOS)
  // specifically, hostname is empty and path name has the format "//hostname/pathname"
  if (!hostname.length && pathname.length) {
    const matchGroups = pathname.match(/^\/\/(?<hostname>[^/]+)(?<pathname>\/?.*)$/)!.groups!
    hostname = matchGroups.hostname!
    pathname = matchGroups.pathname!
  }

  // v0 CID, fix loss of case sensitivity
  if (hostname.startsWith('qm')) {
    const start = url.search(new RegExp(hostname, 'i'))
    hostname = url.slice(start, hostname.length + start)
  }

  const nodeHost = node.port ? `${node.host}:${node.port}` : node.host
  const nodeProtocol = node.remote ? 'https' : 'http'

  if (protocol === 'ipfs:') {
    return node.remote && base32cid(hostname)
      ? `${nodeProtocol}://${hostname}.ipfs.${nodeHost}${pathname}${search}`
      : `${nodeProtocol}://${nodeHost}/ipfs/${hostname}${pathname}${search}` // use paths on local
  }
  if (protocol === 'ipns:') {
    // use path as per https://github.com/ipfs/infra/issues/506#issuecomment-729850579
    return `${nodeProtocol}://${nodeHost}/ipns/${hostname}${pathname}${search}`
  }

  throw new Error(`Failed to transform URL: ${url}`)
}

export const transformForShare = (url: string, node?: string) => {
  const gateway = defaultNodes.find(n => n.host === node) || defaultNodes[0]
  return transform(url, gateway)
}

export const open = (url: string, node?: Node) => {
  console.log('Attempting to open:', url)

  const transformed = node ? transform(url, node) : transformForShare(url, node)
  if (transformed) window.open(transformed)
}

// presuppose that w3s.link is our best bet, but include local so it health checks for it on startup
export const defaultNodes: Node[] = [
  { host: 'w3s.link', healthy: true, remote: true, hot: true },
  { host: 'dweb.link', healthy: true, remote: true },
  { host: 'cf-ipfs.com', healthy: true, remote: true },
  { host: '4everland.io', healthy: true, remote: true },
  { host: 'nftstorage.link', healthy: true, remote: true, hot: true },
  { host: 'localhost', healthy: false, remote: false, port: 8080 }
]

const healthCheck = memo(async (remote: boolean, host: string, port?: number, hot?: boolean) => {
  try {
    const start = Date.now()
    const url = transform(`ipfs://${TEST_CID}?now=${Date.now()}`, { host, port, remote, healthy: true })
    const res = await fetch(url)
    if (res.status !== 200) return { healthy: false }
    let speed = Date.now() - start
    if (hot) speed = speed - 1000 // prioritize hot gateways as they are more consistent
    return { healthy: true, speed, hot }
  } catch (_) {
    return { healthy: false }
  }
}, { isPromise: true, isDeepEqual: true, maxAge: MAX_CHECK_INTERVAL, maxSize: 100 })

const getNodeStatus = async (node: Partial<Node>): Promise<Node> => {
  const { healthy, speed, hot } = await healthCheck(node.remote!, node.host!, node.port, node.hot)
  return { ...node, healthy, speed, hot } as Node
}

const getNodeList = async (nodes: Partial<Node>[]): Promise<Node[]> =>
  pMap(nodes, getNodeStatus, { concurrency: 6 })

const useNodeState = createPersistedState<Node[]>('ipfs-nodes', sessionStorage)

// create a single network listener for mDNS
const NodeListener = new EventEmitter()
Zeroconf.watch('_ipfs-discovery._udp.', 'local.').subscribe((result) => {
  NodeListener.emit(result.action, result)
})

export const useNodes = () => {
  const [nodes, setNodes] = useNodeState(defaultNodes)

  // speed test nodes on startup
  useEffect(() => {
    const update = async () => {
      setNodes(await getNodeList(nodes))
    }
    update()
    const interval = setInterval(update, MAX_CHECK_INTERVAL / 2)
    return () => clearInterval(interval)
  }, [])

  // tap into node listener
  useEffect(() => {
    const addNode = async (result: ZeroconfResult) => {
      const ips = result.service.ipv4Addresses
        .map((ip) => ip === '127.0.0.1' ? 'localhost' : ip)
        .filter((ip) => ip && !nodes.some((n) => n.host === ip && n.healthy)) // already there
      if (ips.length === 0) return
      console.log('Found new local node:', ips, result.service)
      setNodes(await getNodeList([
        ...ips
          .map((ip) => ({ host: ip, port: 8080, remote: false })),
        ...nodes
      ]))
    }
    const removeNode = (result: ZeroconfResult) => {
      const ips = result.service.ipv4Addresses
      if (ips.length === 0) return
      setNodes((nodes) => nodes.filter((n) => ips.includes(n.host)))
    }

    NodeListener.on('resolved', addNode)
    NodeListener.on('removed', removeNode)
    return () => {
      NodeListener.removeListener('resolved', addNode)
      NodeListener.removeListener('removed', removeNode)
    }
  }, [])

  const ranked = useMemo(() => {
    const ranked = orderBy(uniqBy(nodes, 'host'), ['speed'], 'asc').filter((node) => node.healthy)
    return ranked.length === 0 ? [defaultNodes[0]] : ranked
  }, [nodes])

  return { nodes: ranked }
}
