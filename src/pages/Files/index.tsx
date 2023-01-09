import {
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonHeader,
  useIonModal,
} from "@ionic/react"
import { DateTime } from "luxon"
import createPersistedState from "use-persisted-state"
import PageContainer from "../../components/PageContainer"
import { transformForShare } from "../../util/ipfs"
import FileIcon from "../../components/FileIcon"
import "./index.scss"
import { useState } from "react"
import File from "../File"

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

const Files: React.FC = () => {
  const [uploadedFiles, ] = useUploadedFiles([])
  const [currentUpload, setCurrentUpload] = useState<Upload>()

  const hasFiles = uploadedFiles.length > 0

  const [present, dismiss] = useIonModal(File, {
    upload: currentUpload,
    onDismiss: (data: string, role: string) => dismiss(data, role),
  })

  const openModal = (e: MouseEvent, upload: Upload) => {
    e.preventDefault()
    setCurrentUpload(upload)
    present({})
  }

  const listContent = hasFiles && (
    <IonList className="ion-margin-top">
      {uploadedFiles.map((upload, i) => (
        <IonItem
          key={`${i}-${upload.url}`}
          target="_blank"
          className="durin-file"
          rel="noreferrer noopener"
          onClick={(e) => openModal(e as any, upload)}
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
            <h3 className="durin-file_url">{transformForShare(upload.url)}</h3>
            <p className="durin-file_date">
              {DateTime.fromISO(upload.date).toLocaleString(
                DateTime.DATETIME_MED
              )}
            </p>
          </IonLabel>
        </IonItem>
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
          <IonLabel className="durin-label ion-text-center ion-no-padding">Previously Uploaded</IonLabel>
          {listContent}
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default Files
