import { IonPage, IonTitle, IonToolbar, IonButton, IonHeader, IonInput } from '@ionic/react'
import { useState } from 'react'
import PageContainer from '../../components/PageContainer'
import { useNodes, open } from '../../util/ipfs'
import './index.css'

const Browse: React.FC = () => {
  const [ url, setUrl ] = useState('')
  const { nodes } = useNodes()
  return (
    <IonPage className="browse-page">
      <IonHeader>
      <IonToolbar>
        <IonTitle>Browse</IonTitle>
      </IonToolbar>
      </IonHeader>
      <PageContainer>
        <IonInput
          type="url"
          inputmode="url"
          placeholder="Enter CID, IPFS, or IPNS"
          value={url}
          onIonChange={(e) => setUrl(e.detail.value || '')} />
        <IonButton expand="block" onClick={() => open(url, nodes[0])}>Open In Browser</IonButton>
      </PageContainer>
    </IonPage>
  )
}

export default Browse
