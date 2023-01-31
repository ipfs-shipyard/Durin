import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonLabel,
  IonRadioGroup,
  IonItem,
  IonRadio
} from '@ionic/react'
import { useNodes, defaultNodes, SettingsObject } from '../../util/ipfs'
import PageContainer from '../../components/PageContainer'
import createPersistedState from 'use-persisted-state'
import { FC } from 'react'

import './index.scss'

const Settings: FC = () => {
  const { nodes } = useNodes()
  const useSettings = createPersistedState<SettingsObject>('durin-settings')
  const [settings, setSettings] = useSettings({
    node: 'auto'
  })
  const { node } = settings

  return (
    <IonPage className="settings-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonImg src="./assets/images/durin-logo.svg" className="logo" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <PageContainer>
        <div className="durin-page-container fill-height">
          <div className="durin-settings-group">
          <IonLabel className="durin-label">Gateways</IonLabel>
            <IonRadioGroup name="durinNode" value={node} onIonChange={
              e => setSettings({
                node: e.detail.value!
              })}>
              <IonItem>
                <IonLabel>
                  auto
                </IonLabel>
                <IonRadio slot="end" value='auto'></IonRadio>
              </IonItem>
              {nodes.map((n) => (
                <IonItem key={n.host}>
                  <IonLabel>
                    {n.host} - {n.speed}ms
                  </IonLabel>
                  <IonRadio slot="end" value={n.host}></IonRadio>
                </IonItem>
              ))}

              {defaultNodes.filter((n) => !nodes.map(h => h.host).includes(n.host)).map((n) => (
                <IonItem key={n.host} disabled>
                  <IonLabel>
                    {n.host}
                  </IonLabel>
                  <IonRadio slot="end" value={n.host}></IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
          </div>
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default Settings
