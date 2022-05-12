import { IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { useNodes } from '../../util/ipfs'
import PageContainer from '../../components/PageContainer'
import './index.css'

const Settings: React.FC = () => {
  const { nodes } = useNodes()
  return (
    <IonPage className="settings-page">
      <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
      </IonHeader>
      <PageContainer title="Coming Soon!" text="This page is under construction - check back in a future release.">
        <h5 style={{ marginTop: 32 }}>Available Nodes</h5>
        {nodes.map((n) =>
          <p key={n.host}>{n.host} - {n.speed}ms</p>
        )}
      </PageContainer>
    </IonPage>
  )
}

export default Settings
