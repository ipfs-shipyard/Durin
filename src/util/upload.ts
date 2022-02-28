import { Web3Storage } from 'web3.storage'

if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) throw new Error('Missing env.WEB3_STORAGE_TOKEN')

const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })

const upload = async (file: File) => {
  const cid = await client.put([ file ])
  return `ipfs://${cid}/${file.name}`
}

export default upload