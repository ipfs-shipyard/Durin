import { IonContent } from '@ionic/react'
import { FC } from 'react'
import './index.scss'

interface ContainerProps {
  title?: string
  text?: string
}

const PageContainer: FC<ContainerProps> = ({ title, text, children }) => {
  return (
    <div className="page-container-component">
      <IonContent className="ion-padding">
        {title && <strong>{title}</strong>}
        {text && <p>{text}</p>}
        {children}
      </IonContent>
    </div>
  )
}

export default PageContainer
