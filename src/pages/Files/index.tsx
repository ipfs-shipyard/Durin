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

const Files: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles([])
  const { nodes } = useNodes()

  const hasFiles = uploadedFiles.length > 0

  const deleteUploadedFile = (idx: number) => {
    const newList = [...uploadedFiles]
    newList.splice(idx, 1)
    setUploadedFiles(newList)
  }

  const listContent = hasFiles && (
    <IonList>
      {uploadedFiles.map((upload, i) => (
        <IonItem
          key={`${i}-${upload.url}`}
          target="_blank"
          className="durin-file"
          rel="noreferrer noopener"
          routerLink={`/files/${upload.cid}`}
        >
          <IonThumbnail slot="start" className="durin-file_thumbnail">
            {upload.thumbnail ? (
              <IonImg src={upload.thumbnail} alt={upload.extension} />
            ) : (
              <FileIcon extension={upload.extension} />
            )}
          </IonThumbnail>
          <IonLabel>
            <h2 className="durin-file_name">{upload.name}</h2>
            <h3 className="durin-file_url">{upload.url}</h3>
            <p className="durin-file_date">
              {DateTime.fromISO(upload.date).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </p>
          </IonLabel>
        </IonItem>
        /* <IonItemOptions side="end">
            {hasNativeShare && (
              <IonItemOption onClick={() => nativeShare(upload.url)}>
                <IonIcon icon={share} slot="icon-only" />
              </IonItemOption>
            )}
            <IonItemOption color="danger" onClick={() => deleteUploadedFile(i)}>
              <IonIcon icon={trash} slot="icon-only" />
            </IonItemOption>
          </IonItemOptions> */
      ))}
    </IonList>
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
          <IonLabel className="durin-label">Previously Uploaded</IonLabel>
          {listContent}
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default Files
