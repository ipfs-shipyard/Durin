import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonLabel,
  IonRadioGroup,
  IonItem,
  IonRadio,
  IonNote
} from '@ionic/react'
import { useNodes, defaultNodes, SettingsObject, Node } from '../../util/ipfs'
import PageContainer from '../../components/PageContainer'
import createPersistedState from 'use-persisted-state'
import { FC } from 'react'

import './index.scss'
import ShortcutLinks from '../../components/Shortcuts'
import Web3StorageToken from '../../components/Web3StorageToken'

function displayRacing (node: Node) {
  return node.hot ? '🏁' : null
}

const Settings: FC = () => {
  const { nodes } = useNodes()
  const useSettings = createPersistedState<SettingsObject>('durin-settings')
  const [settings, setSettings] = useSettings({
    node: 'auto',
    web3storageToken: ''
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
                ...settings,
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
                    {n.host} {displayRacing(n)} - {n.speed}ms
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
            <div className="ion-text-center">
              <IonNote>🏁 indicates a Racing Gateway</IonNote>
            </div>
          </div>

          <div className="durin-settings-group">
            <IonLabel className="durin-label">Shortcuts</IonLabel>
              <ShortcutLinks />
          </div>

          <div className="durin-settings-group">
            <IonLabel className="durin-label">Web3.Storage Token</IonLabel>
              <Web3StorageToken />
          </div>
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default Settings
