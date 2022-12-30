import {
  IonButton,
  IonContent,
  IonPage,
  IonLabel,
  IonIcon,
  IonImg,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react"
import { closeOutline, share, trash } from "ionicons/icons"
import { DateTime } from "luxon"
import createPersistedState from "use-persisted-state"
import { transformForShare } from "../../util/ipfs"
import PageContainer from "../../components/PageContainer"
import FileIcon from "../../components/FileIcon"
import "./index.scss"
import { useEffect, useRef } from "react"

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

type ModalProps = {
  upload: Upload
  onDismiss: (data?: string | null | undefined | number, role?: string) => void
}

const File: React.FC<ModalProps> = ({ upload, onDismiss }) => {
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles([])

  const deleteUploadedFile = (cid: string) => {
    const newList = [...uploadedFiles].filter((u) => u.cid !== cid)
    setUploadedFiles(newList)
  }

  const foundFile = upload
  // const foundFile =
  //   hasFiles && match && uploadedFiles.find((u) => u.cid === match.params.id)

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
        <IonLabel className="durin-label">File URL:</IonLabel>
        <p>
          <a className="durin-file_url" href={foundFile.url}>
            {foundFile.url}
          </a>
        </p>
        <IonLabel className="durin-label ion-margin-top">File Uploaded:</IonLabel>
        <p className="durin-file_date">
          {DateTime.fromISO(foundFile.date).toLocaleString(
            DateTime.DATETIME_MED
          )}
        </p>
      </div>

      <div className="durin-buttons-row">
        <IonButton className="durin-button-alt" expand="block" size="small">
          Copy CID
        </IonButton>

        <IonButton className="durin-button-alt" expand="block" size="small">
          Show QR Code
        </IonButton>
      </div>

      <div className="durin-buttons">
        {hasNativeShare && (
          <IonButton className="durin-button" onClick={() => nativeShare(foundFile.url)}>
            Share
          </IonButton>
        )}
        <IonButton
          color="danger"
          className="durin-button"
          onClick={() => deleteUploadedFile(foundFile.cid)}
        >
          Delete
        </IonButton>
      </div>
    </>
  )

  return (
    <IonPage className="file-modal">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton color="light" onClick={() => onDismiss(null, "cancel")}>
              <IonIcon icon={closeOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <PageContainer>
        <div className="durin-page-container flex-col">
          <IonLabel className="durin-label ion-text-center ion-margin-bottom">Share</IonLabel>
          {fileContent}
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default File
