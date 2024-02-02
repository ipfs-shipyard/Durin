import { Web3Storage } from 'web3.storage'

let client: Web3Storage

type Options = {
  onProgress?: (progress: number, total: number) => void
}

export const maxChunkSize = 1048576 // MAX_BLOCK_SIZE in SDK

const upload = async (file: File, web3StorageToken: string, options?: Options) => {
  if (!client) {
    if (!web3StorageToken) throw new Error('Missing WEB3_STORAGE_TOKEN')
    client = new Web3Storage({
      endpoint: new URL('https://api.web3.storage'),
      token: web3StorageToken
    })
  }

  let progress = 0
  const cid = await client.put([file], {
    maxChunkSize, // 1mb
    onStoredChunk: (chunkSize) => {
      progress += chunkSize
      if (options?.onProgress) options.onProgress(progress, file.size)
    }
  })
  return {
    cid,
    url: `ipfs://${cid}/${file.name}`
  }
}

export default upload
