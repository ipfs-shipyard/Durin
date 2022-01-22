import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput } from '@ionic/react'
import { useState } from 'react'
import PageContainer from '../../components/PageContainer'
import open from '../../util/open'
import './index.css'

const View: React.FC = () => {
  const [ url, setUrl ] = useState('')
  return (
    <IonPage className="view-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>View</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">View</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PageContainer>
          <IonInput
            type="url"
            inputmode="url"
            color="primary"
            placeholder="ipfs://Qm..."
            value={url}
            onIonChange={(e) => setUrl(e.detail.value || '')} />
          <IonButton onClick={() => open(url)}>Open In Browser</IonButton>
        </PageContainer>
      </IonContent>
    </IonPage>
  )
}

export default View
