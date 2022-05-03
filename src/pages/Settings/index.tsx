import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import PageContainer from '../../components/PageContainer'
import './index.css'

const Settings: React.FC = () => {
  return (
    <IonPage className="settings-page">
      <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
      </IonHeader>
      <PageContainer title="Coming Soon!" text="This page is under construction - check back in a future release." />
    </IonPage>
  )
}

export default Settings
