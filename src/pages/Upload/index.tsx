import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import PageContainer from '../../components/PageContainer'
import './index.css'

const Upload: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Upload</IonTitle>
          </IonToolbar>
        </IonHeader>
        <PageContainer title="Coming Soon!" text="This page is under construction - check back in a future release." />
      </IonContent>
    </IonPage>
  )
}

export default Upload
