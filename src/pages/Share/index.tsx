import { IonButton, IonContent, IonPage, IonTitle, IonToolbar, IonItemSliding, IonItemOptions, IonItemOption, IonSpinner, IonList, IonItem, IonLabel, IonListHeader, IonAvatar, IonIcon, IonButtons, IonModal, IonImg, IonHeader } from '@ionic/react'
import { share, trash, addCircleOutline } from 'ionicons/icons'
import { useState } from 'react'
import { DateTime } from 'luxon'
import createPersistedState from 'use-persisted-state'
import { transform } from '../../util/open'
import upload from '../../util/upload'
import PageContainer from '../../components/PageContainer'
import './index.css'

type Upload = {
  name: string
  url: string
  mimeType: string
  date: string
}
const useUploadedFiles = createPersistedState<Upload[]>('uploaded-files')
const hasNativeShare = typeof navigator.share === 'function'
const nativeShare = (url: string) => {
  navigator.share({ url: transform(url) })
}

const Share: React.FC = () => {
  const [ file, setFile ] = useState<File>()
  const [ isUsingModal, setIsUsingModal ] = useState(false)
  const [ isUploading, setIsUploading ] = useState(false)
  const [ url, setUrl ] = useState('')
  const [ uploadedFiles, setUploadedFiles ] = useUploadedFiles([])
  const hasFiles = uploadedFiles.length > 0

  const uploadFile = async () => {
    if (!file) return
    setIsUploading(true)
    const url = await upload(file)
    setUrl(url)
    setIsUploading(false)
    const newUpload: Upload = {
      name: file.name,
      url,
      mimeType: file.type,
      date: new Date().toISOString()
    }
    setUploadedFiles([ newUpload, ...uploadedFiles ])
  }
  const deleteUploadedFile = (idx: number) => {
    const newList = [ ...uploadedFiles ]
    newList.splice(idx, 1)
    setUploadedFiles(newList)
  }

  const listContent = hasFiles && <IonContent>
    <IonListHeader>Previously Uploaded</IonListHeader>
    <IonList>
      {uploadedFiles.map((upload, i) =>
        <IonItemSliding key={`${i}-${upload.url}`}>
          <IonItem>
            <IonAvatar slot="start">
              <IonImg src={transform(upload.url)} alt="" /> {/* TODO: mimetype image! */}
            </IonAvatar>
            <IonLabel>
              <h2>{upload.name}</h2>
              <h3>{upload.url}</h3>
              <p>{DateTime.fromISO(upload.date).toLocaleString(DateTime.DATE_SHORT)}</p>
            </IonLabel>
          </IonItem>
          <IonItemOptions side="end">
            {hasNativeShare && <IonItemOption onClick={() => nativeShare(upload.url)}>
              <IonIcon icon={share} slot="icon-only" />
            </IonItemOption>}
            <IonItemOption color="danger" onClick={() => deleteUploadedFile(i)}>
              <IonIcon icon={trash} slot="icon-only" />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>)}
    </IonList>
  </IonContent>

  const successContent = url && <>
    <p className="success-text">Your file is available <a target="_blank" rel="noreferrer noopener" href={transform(url)}>here</a>.</p>
      <IonButton expand="block" onClick={() => {
        setUrl('')
        setIsUsingModal(true)
      }}>Upload Another</IonButton>
      {hasNativeShare && <IonButton expand="block" className="share-link" onClick={() => nativeShare(url)}>Share URL</IonButton>}
  </>

  const uploadContent = <>
    <input type="file" className="big-input" onChange={(e) => setFile(e.target?.files?.[0])} disabled={isUploading} placeholder="Select a file"></input>
    <IonButton disabled={!file || isUploading} onClick={uploadFile} className="big-button">
      <IonLabel>{isUploading ? 'Uploading...' : 'Upload'}</IonLabel>
      {isUploading ? <IonSpinner /> : null}
    </IonButton>
  </>
  const mainContent = url
    ? <PageContainer title="Success!">{successContent}</PageContainer>
    : <PageContainer>{uploadContent}</PageContainer>

  const uploadModal = <IonModal
    className="share-page"
    isOpen={isUsingModal}
    onDidDismiss={() => {
      setUrl('')
      setIsUsingModal(false)
    }}
    swipeToClose={true}
    breakpoints={[0.1, 0.5, 1]}
    initialBreakpoint={0.5}>
    <div className="share-page-modal-inner">
      {url ? successContent : uploadContent}
    </div>
  </IonModal>

  return <IonPage className="share-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Share</IonTitle>
        {hasFiles && <IonButtons slot="end">
          <IonButton disabled={isUsingModal} onClick={() => setIsUsingModal(true)}>
            <IonIcon slot="icon-only" icon={addCircleOutline} />
          </IonButton>
        </IonButtons>}
      </IonToolbar>
    </IonHeader>
    {isUsingModal ? listContent : listContent || mainContent}
    {uploadModal} 
  </IonPage>
}

export default Share
