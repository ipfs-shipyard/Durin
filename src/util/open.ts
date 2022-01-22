const open = (url: string) => {
  const { protocol, hostname, pathname } = new URL(url)

  console.log('Attempting to open:', url)
  if (protocol === 'ipfs:') {
    window.open(`https://${hostname}.ipfs.dweb.link${pathname}`)
  }
  if (protocol === 'ipns:') {
    window.open(`https://${hostname}.ipns.dweb.link${pathname}`)
  }
}

export default open