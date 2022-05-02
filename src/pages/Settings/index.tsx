import { IonContent, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import PageContainer from '../../components/PageContainer'
import './index.css'

const Settings: React.FC = () => {
  return (
    <IonPage className="settings-page">
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
      <IonContent fullscreen>
        <PageContainer title="Coming Soon!" text="This page is under construction - check back in a future release." />
      </IonContent>
    </IonPage>
  )
}

export default Settings
