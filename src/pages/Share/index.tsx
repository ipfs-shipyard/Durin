import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import PageContainer from '../../components/PageContainer'
import './index.css'

const Share: React.FC = () => {
  return (
    <IonPage>
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
        <PageContainer title="Coming Soon!" text="This page is under construction - check back in a future release." />
      </IonContent>
    </IonPage>
  )
}

export default Share
