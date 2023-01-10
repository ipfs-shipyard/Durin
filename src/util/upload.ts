import { Web3Storage } from 'web3.storage'

if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) throw new Error('Missing env.WEB3_STORAGE_TOKEN')

const client = new Web3Storage({
  endpoint: new URL('https://api.web3.storage'),
  token: process.env.REACT_APP_WEB3_STORAGE_TOKEN
})

type Options = {
  onProgress?: (progress: number, total: number) => void
}

export const maxChunkSize = 1048576 // MAX_BLOCK_SIZE in SDK

const upload = async (file: File, options?: Options) => {
  let progress = 0
  const cid = await client.put([ file ], {
    maxChunkSize, // 1mb
    onStoredChunk: (chunkSize) => {
      progress += chunkSize
      if (options?.onProgress) options.onProgress(progress, file.size)
    }
  })
  return {
    cid: cid,
    url: `ipfs://${cid}/${file.name}`
  }
}

export default upload