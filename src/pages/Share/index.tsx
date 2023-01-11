import {
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonImg,
  IonHeader,
  IonProgressBar,
  IonText,
  IonThumbnail
} from '@ionic/react'
import { useState, FC } from 'react'
import { DateTime } from 'luxon'
import createPersistedState from 'use-persisted-state'
import { getThumbnailUrl } from 'image-thumbnail-generator'
import { transformForShare } from '../../util/ipfs'
import upload, { maxChunkSize } from '../../util/upload'
import PageContainer from '../../components/PageContainer'
import FileIcon from '../../components/FileIcon'
import QRCode from 'react-qr-code'
import './index.scss'

const BIG_FILE_THRESHOLD = 5 * 1024 // 5mb
const PROGRESS_THRESHOLD = maxChunkSize / 1000

type Upload = {
  name: string
  cid: string
  url: string
  mimeType: string
  extension?: string
  thumbnail?: string
  date: string
}
const useUploadedFiles = createPersistedState<Upload[]>('uploaded-files')
const hasNativeShare = typeof navigator.share === 'function'
const nativeShare = (url: string) => {
  navigator.share({ url: transformForShare(url) })
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

const Share: FC = () => {
  const [file, setFile] = useState<File>()
  const [error, setError] = useState<Error>()
  const [isUsingModal, setIsUsingModal] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(defaultUploadProgress)
  const [url, setUrl] = useState('')
  const [, setCid] = useState('')
  const [uploadedFile, setUploadedFile] = useState<Upload>()
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles([])

  const hasFiles = uploadedFiles.length > 0

  const uploadFile = async () => {
    if (!file) return
    setIsUploading(true)
    let uploadedFile
    try {
      uploadedFile = await upload(file, {
        onProgress: (progress, total) => setUploadProgress([progress, total])
      })
    } catch (err) {
      setError(error)
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
      name: file.name,
      cid: uploadedFile.cid,
      url: uploadedFile.url,
      mimeType: file.type,
      extension: file.name.split('.').pop(),
      thumbnail: file.type.startsWith('image/')
        ? await createThumbnail(file)
        : undefined,
      date: new Date().toISOString()
    }
    setUploadedFiles([newUpload, ...uploadedFiles])
    setUploadedFile(newUpload)
    setFile(undefined)

    if (!hasFiles) setIsUsingModal(true) // open the success state in the modal if its their first upload
  }

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
            <h3 className="durin-file_url">{transformForShare(uploadedFile.url)}</h3>
            <p className="durin-file_date">
              {DateTime.fromISO(uploadedFile.date).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </p>
          </IonLabel>
        </IonItem>
      </IonList>

      <div className="durin-qr">
        <QRCode value={transformForShare(uploadedFile.url)} />
      </div>

      <div className="durin-view-ipfs ion-margin-top">
        <a href={transformForShare(uploadedFile.url)} target="_blank" rel="noreferrer">View it on IPFS</a>
      </div>

      <div className="durin-buttons">
        <IonButton
          expand="block"
          className="durin-button-alt"
          routerLink="/files"
          onClick={() => {
            setUrl('')
            setIsUsingModal(true)
          }}
        >
          Go to Uploads List
        </IonButton>
        <IonButton
          expand="block"
          className="durin-button"
          onClick={() => {
            setUrl('')
            setIsUsingModal(true)
          }}
        >
          Upload Another
        </IonButton>
        {hasNativeShare && (
          <IonButton
            expand="block"
            className="durin-button"
            onClick={() => nativeShare(url)}
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
        onClick={uploadFile}
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
    </div>
  )
  const mainContent = url
    ? (
    <PageContainer>
      <div className="durin-page-container flex-col">{successContent}</div>
    </PageContainer>
      )
    : (
    <PageContainer>
      <div className="durin-page-container flex-col center">
        <div>{uploadContent}</div>
      </div>
    </PageContainer>
      )

  // eslint-disable-next-line no-unused-vars
  const uploadModal = (
    <IonModal
      className="share-page"
      isOpen={isUsingModal}
      onDidDismiss={() => {
        setUrl('')
        setIsUsingModal(false)
      }}
      canDismiss={true}
      breakpoints={[0, 0.5, 1]}
      initialBreakpoint={0.5}
    >
      <div className="share-page-modal-inner">
        {url ? successContent : uploadContent}
      </div>
    </IonModal>
  )

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
