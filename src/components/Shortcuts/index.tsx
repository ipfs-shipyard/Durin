import { IonImg, IonItem, IonLabel, IonList, IonThumbnail } from "@ionic/react"
import "./index.scss"

const defaultLinks = [
    { name: "Wikipedia", value: "ipns://en.wikipedia-on-ipfs.org", logo: "wikipedia.png" },
    { name: "PeerPad", value: "ipns://peerpad.net", logo: "peerpad.png" },
    { name: "Uniswap", value: "ipns://app.uniswap.org", logo: "uniswap.png" },
]
const ShortcutLinks: React.FC = () => {
    return (
        <IonList>
            {defaultLinks.map((link) => (
                <IonItem key={link.name} href={link.value} target="blank" className="durin-shortcut-link">
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
