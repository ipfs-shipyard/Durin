import { IonContent } from "@ionic/react"
import "./index.scss"

interface ContainerProps {
  title?: string
  text?: string
}

const PageContainer: React.FC<ContainerProps> = ({ title, text, children }) => {
  return (
    <div className="page-container-component">
      <IonContent>
        {title && <strong>{title}</strong>}
        {text && <p>{text}</p>}
        {children}
      </IonContent>
    </div>
  )
}

export default PageContainer
