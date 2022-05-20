import { IonPage, IonTitle, IonToolbar, IonButton, IonHeader, IonInput } from '@ionic/react'
import { useState } from 'react'
import { Flex, Box } from 'react-flex-lite'
import { useNodes, open } from '../../util/ipfs'
import './index.scss'

const defaultLinks = [
  { name: 'Wikipedia', value: 'ipns://en.wikipedia-on-ipfs.org' },
  { name: 'PeerPad', value: 'ipns://peerpad.net' },
  { name: 'Orbit', value: 'ipns://orbit.chat' }
]

const Browse: React.FC = () => {
  const [ url, setUrl ] = useState('')
  const { nodes } = useNodes()
  return (
    <IonPage className="browse-page">
      <IonHeader>
      <IonToolbar>
        <IonTitle>Browse</IonTitle>
      </IonToolbar>
      </IonHeader>
      <Flex auto column center h="100%">
        <Box className="inputs" pb={3}>
          <IonInput
            type="url"
            inputmode="url"
            placeholder="Enter CID, IPFS URL, or IPNS"
            value={url}
            onIonChange={(e) => setUrl(e.detail.value?.trim() || '')} />
          <IonButton expand="block" disabled={!url} onClick={() => open(url, nodes[0])}>Open In Browser</IonButton>
        </Box>
        <h6>Shortcuts</h6>
        <Flex pt={1} className="shortcuts">
          {defaultLinks.map(({ name, value }) =>
            <button key={value} onClick={() => open(value, nodes[0])}>{name}</button>
          )}
        </Flex>
      </Flex>
    </IonPage>
  )
}

export default Browse
