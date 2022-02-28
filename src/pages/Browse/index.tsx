import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/react'
import { useState } from 'react'
import PageContainer from '../../components/PageContainer'
import open from '../../util/open'
import './index.css'

const Browse: React.FC = () => {
  const [ url, setUrl ] = useState('')
  return (
    <IonPage className="browse-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Browse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Browse</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PageContainer>
          <IonInput
            type="url"
            inputmode="url"
            color="primary"
            placeholder="Enter CID, IPFS, or IPNS"
            value={url}
            onIonChange={(e) => setUrl(e.detail.value || '')} />
          <IonButton expand="block" onClick={() => open(url)}>Open In Browser</IonButton>
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

export default Browse
