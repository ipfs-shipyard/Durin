import {
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonHeader,
  IonProgressBar,
  IonText,
  IonThumbnail
} from '@ionic/react'
import { useState, FC, useEffect, useCallback } from 'react'
import { DateTime } from 'luxon'
import createPersistedState from 'use-persisted-state'
import { base64 } from 'rfc4648'
import { getThumbnailUrl } from 'image-thumbnail-generator'
import { Filesystem } from '@capacitor/filesystem'
import { RouteChildrenProps } from 'react-router'
import { SettingsObject, transformForShare } from '../../util/ipfs'
import upload, { maxChunkSize } from '../../util/upload'
import PageContainer from '../../components/PageContainer'
import FileIcon from '../../components/FileIcon'
import QRCode from 'react-qr-code'
import './index.scss'

type Upload = {
  name: string
  cid: string
  url: string
  mimeType: string
  extension?: string
  thumbnail?: string
  date: string
}
export interface ShareComponentRouteState {
  title: string
  description: string
  type: string
  url: string
  webPath: string
}

const BIG_FILE_THRESHOLD = 5 * 1024 // 5mb
const PROGRESS_THRESHOLD = maxChunkSize / 1000

const useUploadedFiles = createPersistedState<Upload[]>('uploaded-files')
const useSettings = createPersistedState<SettingsObject>('durin-settings')

const hasNativeShare = typeof navigator.share === 'function'
const nativeShare = (url: string, node: string) => {
  navigator.share({ url: transformForShare(url, node) })
}
const createThumbnail = async (file: File): Promise<string | undefined> => {
  try {
    const { thumbnail } = await getThumbnailUrl(file, 80, 80) // 2x the size of the preview
    return thumbnail
  } catch (err) {
    console.error('Error making thumbnail:', err)
  }
}
const defaultUploadProgress: [number, number] = [0, 1]

const Share: FC<RouteChildrenProps<{}, ShareComponentRouteState>> = ({ location, history }) => {
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<Error>()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(defaultUploadProgress)
  const [url, setUrl] = useState('')
  const [, setCid] = useState('')
  const [uploadedFile, setUploadedFile] = useState<Upload>()
  const [, setUploadedFiles] = useUploadedFiles([])
  const [settings] = useSettings({
    node: 'auto',
    web3storageToken: ''
  })

  const uploadFile = useCallback(async (toUpload: File) => {
    if (!toUpload) return
    setIsUploading(true)
    let uploadedFile
    try {
      uploadedFile = await upload(toUpload, settings.web3storageToken, {
        onProgress: (progress, total) => setUploadProgress([progress, total])
      })
    } catch (err) {
      setError(err as Error)
      setIsUploading(false)
      setUploadProgress(defaultUploadProgress)
      console.error('Error uploading file:', err)
      return
    }
    setUrl(uploadedFile.url)
    setCid(uploadedFile.cid)
    setIsUploading(false)
    setUploadProgress(defaultUploadProgress)
    const newUpload: Upload = {
      name: toUpload.name,
      cid: uploadedFile.cid,
      url: uploadedFile.url,
      mimeType: toUpload.type,
      extension: toUpload.name.split('.').pop(),
      thumbnail: toUpload.type.startsWith('image/')
        ? await createThumbnail(toUpload)
        : undefined,
      date: new Date().toISOString()
    }
    setUploadedFiles((prev) => [newUpload, ...prev])
    setUploadedFile(newUpload)
    setFile(undefined)
  }, [setIsUploading, setUploadProgress, setUrl, setCid, setUploadedFiles, setUploadedFile, setFile, settings.web3storageToken])

  useEffect(() => {
    if (!location?.state?.url?.length) {
      return
    }
    setUrl('')
    console.log('auto-upload initiated', location.state.type, location.state.url)
    // TODO: use streams here to use less memory
    Filesystem.readFile({ path: location?.state?.url })
      .then((rfr) => {
        const bits = base64.parse(rfr.data)
        const realizedFile = new File([bits], location.state.url.split('/').pop()!, { type: location.state.type })
        history.replace('/share', {})
        setFile(realizedFile)
        return uploadFile(realizedFile)
      })
      .then(() => {
        console.log('auto-upload complete')
      })
      .catch((err) => {
        setError(err)
        setIsUploading(false)
        setUploadProgress(defaultUploadProgress)
      })
  }, [history, location?.state?.type, location?.state?.url, uploadFile])

  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  const successContent = uploadedFile && (
    <>
      <IonLabel className="durin-label ion-text-center ion-no-padding">Successfully Uploaded File:</IonLabel>
      <IonList className="ion-margin-top ion-margin-bottom">
        <IonItem className="durin-file">
          <IonThumbnail slot="start" className="durin-file_thumbnail">
            {uploadedFile.thumbnail
              ? (
              <IonImg src={uploadedFile.thumbnail} alt={uploadedFile.extension} />
                )
              : (
              <FileIcon extension={uploadedFile.extension} />
                )}
          </IonThumbnail>

          <IonLabel>
            <h2 className="durin-file_name">{uploadedFile.name}</h2>
            <h3 className="durin-file_url">{transformForShare(uploadedFile.url, settings.node)}</h3>
            <p className="durin-file_date">
              {DateTime.fromISO(uploadedFile.date).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </p>
          </IonLabel>
        </IonItem>
      </IonList>

      <div className="durin-qr">
        <QRCode value={transformForShare(uploadedFile.url, settings.node)} />
      </div>

      <div className="durin-view-ipfs ion-margin-top">
        <a href={transformForShare(uploadedFile.url, settings.node)} target="_blank" rel="noreferrer">View it on IPFS</a>
      </div>

      <div className="durin-buttons">
        <IonButton
          expand="block"
          className="durin-button-alt"
          routerLink="/files"
          onClick={() => {
            setUrl('')
          }}
        >
          Go to Uploads List
        </IonButton>
        <IonButton
          expand="block"
          className="durin-button"
          onClick={() => {
            setUrl('')
          }}
        >
          Upload Another
        </IonButton>
        {hasNativeShare && (
          <IonButton
            expand="block"
            className="durin-button"
            onClick={() => nativeShare(url, settings.node)}
          >
            Share
          </IonButton>
        )}
      </div>
    </>
  )

  const uploadContent = (
    <div className="durin-input-container">
      <IonLabel className="durin-label">Select Media to Upload</IonLabel>
      <input
        type="file"
        className={`durin-input ${!!file && 'hasFile'}`}
        onChange={(e) => setFile(e.target?.files?.[0])}
        disabled={isUploading}
        placeholder="Select a file"
        id="durinUpload"
      ></input>
      <IonButton
        disabled={!file || isUploading}
        onClick={() => file && uploadFile(file)}
        className={`durin-button ${!isUploading && 'durin-hide-when-disabled'}`}
      >
        <IonLabel>{isUploading ? 'Uploading...' : 'Upload'}</IonLabel>
      </IonButton>

      {isUploading
        ? <div className="durin-pulse">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
        : null}

      {isUploading && file && file.size > PROGRESS_THRESHOLD && (
        <IonProgressBar value={uploadProgress[0] / uploadProgress[1]} />
      )}
      {isUploading && file && file.size >= BIG_FILE_THRESHOLD && (
        <IonText className="large-file-text" color="light">
          ( This may take a moment, the file is large! )
        </IonText>
      )}
      {error && (
        <IonText className="error-text" color="danger">
          Error: {error.message || String(error)}
        </IonText>
      )}
    </div>
  )
  const mainContent = url
    ? <PageContainer>
      <div className="durin-page-container flex-col">{successContent}</div>
    </PageContainer>
    : <PageContainer>
      <div className="durin-page-container flex-col center">
        <div>{uploadContent}</div>
      </div>
    </PageContainer>

  return (
    <IonPage className="share-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonImg src="./assets/images/durin-logo.svg" className="logo" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      {mainContent}
    </IonPage>
  )
}

export default Share
