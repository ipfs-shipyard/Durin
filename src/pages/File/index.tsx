import {
  IonButton,
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonThumbnail,
  IonIcon,
  IonImg,
  IonHeader,
} from "@ionic/react"
import { share, trash } from "ionicons/icons"
import { DateTime } from "luxon"
import createPersistedState from "use-persisted-state"
import { transform, transformForShare, useNodes } from "../../util/ipfs"
import PageContainer from "../../components/PageContainer"
import FileIcon from "../../components/FileIcon"
import "./index.scss"
import { useEffect } from "react"
import { RouteComponentProps } from "react-router"

type Upload = {
  name: string
  cid: string
  url: string
  mimeType: string
  extension?: string
  thumbnail?: string
  date: string
}
const useUploadedFiles = createPersistedState<Upload[]>("uploaded-files")
const hasNativeShare = typeof navigator.share === "function"
const nativeShare = (url: string) => {
  navigator.share({ url: transformForShare(url) })
}

interface FileDetailPageProps
  extends RouteComponentProps<{
    id: string
  }> {}

const File: React.FC<FileDetailPageProps> = ({ match }) => {
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles([])
  const { nodes } = useNodes()

  const hasFiles = uploadedFiles.length > 0

  useEffect(() => {}, [])

  const deleteUploadedFile = (cid: string) => {
    const newList = [...uploadedFiles].filter((u) => u.cid !== cid)
    setUploadedFiles(newList)
  }

  const foundFile =
    hasFiles && uploadedFiles.find((u) => u.cid === match.params.id)

  const fileContent = foundFile && (
    <>
      {foundFile.thumbnail ? (
        <IonImg
          src={`https://ipfs.io/ipfs/${foundFile.cid}/${foundFile.name}`}
          alt={foundFile.extension}
          className="durin-image-preview"
        />
      ) : (
        <FileIcon extension={foundFile.extension} />
      )}

      <div className="durin-file-view">
        <h2 className="durin-file_name">{foundFile.name}</h2>
        <h3 className="durin-file_url">{foundFile.url}</h3>
        <p className="durin-file_date">
          {DateTime.fromISO(foundFile.date).toLocaleString(
            DateTime.DATETIME_MED
          )}
        </p>
      </div>

      {hasNativeShare && (
        <IonButton onClick={() => nativeShare(foundFile.url)}>
          <IonIcon icon={share} slot="icon-only" />
        </IonButton>
      )}
      <IonButton
        color="danger"
        onClick={() => deleteUploadedFile(foundFile.cid)}
      >
        <IonIcon icon={trash} slot="icon-only" />
      </IonButton>
    </>
  )

  return (
    <IonPage className="share-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonImg src="./assets/images/durin-logo.svg" className="logo" />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <PageContainer>
        <div className="durin-page-container fill-height">
          <IonLabel className="durin-label">File</IonLabel>
          {fileContent}
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default File
