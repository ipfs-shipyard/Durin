import { Web3Storage } from 'web3.storage'

if (!process.env.REACT_APP_WEB3_STORAGE_TOKEN) throw new Error('Missing env.WEB3_STORAGE_TOKEN')

const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_STORAGE_TOKEN })

type Options = {
  onProgress?: (progress: number, total: number) => void
}

const upload = async (file: File, options?: Options) => {
  let progress = 0
  const cid = await client.put([ file ], {
    onStoredChunk: (chunkSize) => {
      progress += chunkSize
      if (options?.onProgress) options.onProgress(progress, file.size)
    }
  })
  return `ipfs://${cid}/${file.name}`
}

export default upload