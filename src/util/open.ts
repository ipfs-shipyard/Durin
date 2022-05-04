import { cid } from 'is-ipfs'
import { Node } from './node'

export const transform = (url: string, node: Node) => {
  // support opening just a CID w/ no protocol
  if (cid(url) || cid(url.split('/')[0])) url = `ipfs://${url}`

  // no protocol, not a CID - assume IPNS
  if (!url.startsWith('ipfs://') && !url.startsWith('ipns://')) url = `ipns://${url}`

  // trim trailing /
  if (url.endsWith('/')) url = url.slice(0, -1)

  const { protocol, hostname, pathname } = new URL(url)

  const nodeHost = node.port ? `${node.host}:${node.port}` : node.host
  const nodeProtocol = node.remote ? 'https' : 'http'

  if (protocol === 'ipfs:') {
    return node.remote
      ? `${nodeProtocol}://${hostname}.ipfs.${nodeHost}${pathname}`
      : `${nodeProtocol}://${nodeHost}/ipfs/${hostname}${pathname}` // use paths on local
  }
  if (protocol === 'ipns:') {
    // use path as per https://github.com/ipfs/infra/issues/506#issuecomment-729850579
    return `${nodeProtocol}://${nodeHost}/ipns/${hostname}${pathname}`
  }
}

export const transformForShare = (url: string) =>
  transform(url, { host: 'dweb.link', healthy: true, remote: true })

const open = (url: string, node?: Node) => {
  console.log('Attempting to open:', url)

  const transformed = node ? transform(url, node) : transformForShare(url)
  if (transformed) window.open(transformed)
}

export default open