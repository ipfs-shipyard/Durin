import { IonImg, IonItem, IonLabel, IonList, IonThumbnail } from '@ionic/react'
import { FC } from 'react'
import createPersistedState from 'use-persisted-state'
import { transformForShare, SettingsObject } from '../../util/ipfs'
import './index.scss'

const defaultLinks = [
  { name: 'Wikipedia', value: 'ipns://en.wikipedia-on-ipfs.org', logo: 'wikipedia.png' },
  { name: 'Save Tweet Now', value: 'https://webrecorder.github.io/save-tweet-now', logo: 'webrecorder.png' },
  { name: 'Diffuse Music player', value: 'ipns://diffuse.sh', logo: 'diffuse.png' }

]
const ShortcutLinks: FC = () => {
  const useSettings = createPersistedState<SettingsObject>('durin-settings')
  const [settings] = useSettings({
    node: 'auto'
  })
  return (
        <IonList>
            {defaultLinks.map((link) => (
                <IonItem key={link.name} href={transformForShare(link.value, settings.node)} target="blank" className="durin-shortcut-link">
                    <IonThumbnail slot="start">
                        <IonImg src={`./assets/images/${link.logo}`} alt={link.name} />
                    </IonThumbnail>
                    <IonLabel>{link.name}</IonLabel>
                </IonItem>
            ))}
        </IonList>
  )
}

export default ShortcutLinks
