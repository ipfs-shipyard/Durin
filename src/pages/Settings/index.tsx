import { IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react'
import { useNodes } from '../../util/ipfs'
import PageContainer from '../../components/PageContainer'
import './index.scss'

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
          <IonText color="light" key={n.host}>{n.host} - {n.speed}ms</IonText>
        )}
      </PageContainer>
    </IonPage>
  )
}

export default Settings
