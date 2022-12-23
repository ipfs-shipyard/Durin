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
} from "@ionic/react"
import { useNodes } from "../../util/ipfs"
import PageContainer from "../../components/PageContainer"
import "./index.scss"
import { Box, Flex } from "react-flex-lite"

const gateways = [
  {
    name: "auto",
  },
  {
    name: "ipfs.io",
  },
  {
    name: "dweb.link",
  },
  {
    name: "gateway.ipfs.io",
  },
  {
    name: "cf-ipfs.com",
  },
  {
    name: "local",
  },
]

const Settings: React.FC = () => {
  const { nodes } = useNodes()
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
            <IonLabel className="durin-label">Available Nodes</IonLabel>
            <IonRadioGroup name="durinNode">
              {nodes.map((n) => (
                <IonItem key={n.host}>
                  <IonLabel>
                    {n.host} - {n.speed}ms
                  </IonLabel>
                  <IonRadio slot="end" value={n.host}></IonRadio>
                </IonItem>
              ))}
            </IonRadioGroup>
          </div>
          <div className="durin-settings-group">
            <IonLabel className="durin-label">Gateways</IonLabel>
            <IonRadioGroup name="duringGateway">
              {gateways.map((g) => (
                <IonItem key={g.name}>
                  <IonLabel>{g.name}</IonLabel>
                  <IonRadio slot="end" value={g.name}></IonRadio>
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
