/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react'
import { Zeroconf, ZeroconfResult } from '@ionic-native/zeroconf'
import pMap from 'p-map'
import { uniqBy, orderBy } from 'lodash'
import memo from 'moize'
import EventEmitter from 'eventemitter3'
import createPersistedState from 'use-persisted-state'

const MAX_CHECK_INTERVAL = 10000

export type Node = {
  host: string
  port?: number
  remote: boolean
  healthy: boolean
  speed?: number
}

// presuppose that dweb.link is our best bet, but include local so it health checks for it on startup
const defaultNodes: Node[] = [
  { host: 'dweb.link', healthy: true, remote: true },
  { host: 'localhost', healthy: false, remote: false, port: 8080 }
]

// QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn is used for health checking: https://github.com/ipfs/go-ipfs/pull/8429/files
const healthCheck = memo(async (host: string, port?: number) => {
  try {
    const start = Date.now()
    const res = await fetch(`http://${port ? `${host}:${port}` : host}/ipfs/QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn?now=${Date.now()}`)
    if (res.status !== 200) return { healthy: false }
    return { healthy: true, speed: Date.now() - start }
  } catch (_) {
    return { healthy: false }
  }
}, { isPromise: true, isDeepEqual: true, maxAge: MAX_CHECK_INTERVAL, maxSize: 100 })

const getNodeStatus = async (node: Partial<Node>): Promise<Node> => {
  const { healthy, speed } = await healthCheck(node.host!, node.port)
  return { ...node, healthy, speed } as Node
}

const getNodeList = async (nodes: Partial<Node>[]): Promise<Node[]> =>
  pMap(nodes, getNodeStatus, { concurrency: 6 })

const useNodeState = createPersistedState<Node[]>('ipfs-nodes')

// create a single network listener for mDNS
const NodeListener = new EventEmitter()
Zeroconf.watch('_ipfs-discovery._udp.', 'local.').subscribe((result) => {
  NodeListener.emit(result.action, result)
})

export const useNodes = () => {
  const [ nodes, setNodes ] = useNodeState(defaultNodes)

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
        .map((ip) => ip === '127.0.0.1' ? 'localhost' : '')
        .filter((ip) => !nodes.some((n) => n.host === ip && n.healthy)) // already there
      if (ips.length === 0) return
      console.log('Found new local node:', ips, result.service)
      setNodes(await getNodeList([
        ...ips
          .map((ip) => ({ host: ip, port: 8080, remote: false })),
        ...nodes
      ]))
    }
    const removeNode = (result: ZeroconfResult) => {
      const ip = result.service.ipv4Addresses[result.service.ipv4Addresses.length - 1]
      if (!ip) return
      setNodes((nodes) => nodes.filter((n) => n.host !== ip))
    }
  
    NodeListener.on('resolved', addNode)
    NodeListener.on('removed', removeNode)
    return () => {
      NodeListener.removeListener('resolved', addNode)
      NodeListener.removeListener('removed', removeNode)
    }
  }, [])

  const ranked = useMemo(() => {
    const ranked = orderBy(uniqBy(nodes, 'host'), [ 'speed' ], 'asc').filter((node) => node.healthy)
    return ranked.length === 0 ? [ defaultNodes[0] ] : ranked
  }, [ nodes ])

  return { nodes: ranked }
}