import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonSpinner } from '@ionic/react'
import { useState } from 'react'
import { transform } from '../../util/open'
import upload from '../../util/upload'
import PageContainer from '../../components/PageContainer'
import './index.css'

const hasNativeShare = typeof navigator.share === 'function'

const Share: React.FC = () => {
  const [ file, setFile ] = useState<File>()
  const [ isUploading, setIsUploading ] = useState(false)
  const [ url, setUrl ] = useState('')

  const uploadFile = async () => {
    if (!file) return
    setIsUploading(true)
    const url = await upload(file)
    setUrl(url)
    setIsUploading(false)
  }
  const share = () => {
    navigator.share({ url: transform(url) })
  }
  const content = <PageContainer>
    <input type="file" onChange={(e) => setFile(e.target?.files?.[0])} disabled={isUploading} placeholder="Select a file"></input>
    <IonButton disabled={!file || isUploading} onClick={uploadFile}>
      <IonLabel>{isUploading ? 'Uploading...' : 'Upload'}</IonLabel>
      {isUploading ? <IonSpinner /> : null}
    </IonButton>
  </PageContainer>
  const successContent = url && <PageContainer title="Success!">
    <p className="success-text">Your file is available <a target="_blank" rel="noreferrer noopener" href={transform(url)}>here</a>.</p>
    <IonButton expand="block" onClick={() => setUrl('')}>Upload Another</IonButton>
    {hasNativeShare && <IonButton expand="block" className="share-link" onClick={share}>Share URL</IonButton>}
  </PageContainer>
  return (
    <IonPage className="share-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Share</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Share</IonTitle>
          </IonToolbar>
        </IonHeader>
        {successContent || content}
      </IonContent>
    </IonPage>
  )
}

export default Share
