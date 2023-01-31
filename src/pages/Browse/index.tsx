import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonHeader,
  IonInput,
  IonLabel,
  IonImg,
  IonModal
} from '@ionic/react'
import { useState, FC } from 'react'
import createPersistedState from 'use-persisted-state'
import PageContainer from '../../components/PageContainer'
import { useNodes, open } from '../../util/ipfs'
import './index.scss'

const Browse: FC = () => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState(false)
  const { nodes } = useNodes()
  const useIntro = createPersistedState<boolean>('durin-intro')
  const [showIntro, setShowIntro] = useIntro(true)

  const validateUrl = (url: string) => {
    setUrl(url)

    if (url.length < 6 && !!url) {
      setError(true)
    } else {
      setError(false)
    }
  }
  return (
    <>
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
            <div className="durin-input-container">
              <IonLabel className="durin-label">
                Enter Cid, IPFS URL, or IPNS
              </IonLabel>
              <IonInput
                type="url"
                inputmode="url"
                placeholder="Enter CID, IPFS URL, or IPNS"
                value={url}
                className={`durin-input ${error && 'error'}`}
                onIonChange={(e) => validateUrl(e.detail.value?.trim() || '')}
              />
              <div className="durin-validation">
                <IonButton
                  expand="block"
                  disabled={!url || error}
                  className="durin-button durin-hide-when-disabled"
                  onClick={() => open(url, nodes[0])}
                >
                  Open In Browser
                </IonButton>

                {error && (
                  <div className="durin-error">
                    <IonLabel>Sample Error Title</IonLabel>
                    <p>Some other context or full address for reference here: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PageContainer>
      </IonPage>

      <IonModal
        className="durin-intro"
        isOpen={showIntro}
        onDidDismiss={() => {
          setShowIntro(false)
        }}
        canDismiss={true}
      >
        <div className="durin-intro-inner">
        <IonButton fill="clear" className="close-icon" onClick={() => setShowIntro(false)}>
          Dismiss
        </IonButton>
          <h3>Welcome to Durin</h3>
          <p>Here are a couple steps to get started.</p>
          <ol>
          <li>Try entering a CID or `IPFS://` url on the home page.</li>
          <li>Checkout the upload tab</li>
          <li>View stats about your connections on the settings tab.</li>
          </ol>
          <IonButton className="durin-button" onClick={() => setShowIntro(false)}>Dismiss</IonButton>
        </div>
      </IonModal>
    </>
  )
}

export default Browse
