import { cid } from 'is-ipfs'

export const transform = (url: string) => {
  // support opening just a CID w/ no protocol
  if (cid(url) || cid(url.split('/')[0])) url = `ipfs://${url}`

  // no protocol, not a CID - assume IPNS
  if (!url.startsWith('ipfs://') && !url.startsWith('ipns://')) url = `ipns://${url}`

  // trim trailing /
  if (url.endsWith('/')) url = url.slice(0, -1)

  const { protocol, hostname, pathname } = new URL(url)

  if (protocol === 'ipfs:') {
    return `https://${hostname}.ipfs.dweb.link${pathname}`
  }
  if (protocol === 'ipns:') {
    // use path as per https://github.com/ipfs/infra/issues/506#issuecomment-729850579
    return `https://dweb.link/ipns/${hostname}${pathname}`
  }
}

const open = (url: string) => {
  console.log('Attempting to open:', url)

  const transformed = transform(url)
  if (transformed) window.open(transformed)
}

export default open