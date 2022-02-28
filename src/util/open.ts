import { cid } from 'is-ipfs'

const open = (url: string) => {
  // support opening just a CID w/ no protocol
  if (cid(url) || cid(url.split('/')[0])) url = `ipfs://${url}`

  // no protocol, not a CID - assume IPNS
  if (!url.startsWith('ipfs://') && !url.startsWith('ipns://')) url = `ipns://${url}`

  // trim trailing /
  if (url.endsWith('/')) url = url.slice(0, -1)

  const { protocol, hostname, pathname } = new URL(url)

  console.log('Attempting to open:', url)
  if (protocol === 'ipfs:') {
    window.open(`https://${hostname}.ipfs.dweb.link${pathname}`)
  }
  if (protocol === 'ipns:') {
    // use path as per https://github.com/ipfs/infra/issues/506#issuecomment-729850579
    window.open(`https://dweb.link/ipns/${hostname}${pathname}`)
  }
}

export default open