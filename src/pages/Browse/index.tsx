import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonHeader,
  IonInput,
  IonLabel,
  IonImg,
} from "@ionic/react"
import { useState } from "react"
import { Flex, Box } from "react-flex-lite"
import PageContainer from "../../components/PageContainer"
import { useNodes, open } from "../../util/ipfs"
import "./index.scss"

const Browse: React.FC = () => {
  const [url, setUrl] = useState("")
  const { nodes } = useNodes()
  return (
    <IonPage className="browse-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonImg src="./assets/images/durin-logo.svg" className="logo" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <PageContainer>
        <div className="durin-page-container flex-col center">
          <div>
            <IonLabel className="durin-label">
              Enter Cid, IPFS URL, or IPNS
            </IonLabel>
            <IonInput
              type="url"
              inputmode="url"
              placeholder="Enter CID, IPFS URL, or IPNS"
              value={url}
              className="durin-input"
              onIonChange={(e) => setUrl(e.detail.value?.trim() || "")}
            />
            <IonButton
              expand="block"
              disabled={!url}
              className="durin-button durin-hide-when-disabled"
              onClick={() => open(url, nodes[0])}
            >
              Open In Browser
            </IonButton>
          </div>
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default Browse
