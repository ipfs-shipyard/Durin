import {
  IonButton,
  IonPage,
  IonLabel,
  IonIcon,
  IonImg,
  IonHeader,
  IonToolbar,
  IonButtons,
  useIonToast,
  IonTitle
} from '@ionic/react'
import { closeOutline, checkmarkCircle } from 'ionicons/icons'
import { DateTime } from 'luxon'
import createPersistedState from 'use-persisted-state'
import { transformForShare } from '../../util/ipfs'
import PageContainer from '../../components/PageContainer'
import FileIcon from '../../components/FileIcon'
import './index.scss'
import { useState, FC } from 'react'
import QRCode from 'react-qr-code'
import { Clipboard } from '@awesome-cordova-plugins/clipboard'

type Upload = {
  name: string
  cid: string
  url: string
  mimeType: string
  extension?: string
  thumbnail?: string
  date: string
}
const useUploadedFiles = createPersistedState<Upload[]>('uploaded-files')
const hasNativeShare = typeof navigator.share === 'function'
const nativeShare = (url: string) => {
  navigator.share({ url: transformForShare(url) })
}

type ModalProps = {
  upload: Upload
  onDismiss: (data?: string | null | undefined | number, role?: string) => void
}

const File: FC<ModalProps> = ({ upload, onDismiss }) => {
  const [uploadedFiles, setUploadedFiles] = useUploadedFiles([])
  const [showQR, setShowQR] = useState(false)
  const [present] = useIonToast()

  const deleteUploadedFile = (cid: string) => {
    const newList = [...uploadedFiles].filter((u) => u.cid !== cid)
    setUploadedFiles(newList)
    onDismiss(null, 'cancel')
  }

  const copyCID = async (cid: string) => {
    await Clipboard.copy(cid)
    present({
      message: `Copied CID: ${cid}`,
      duration: 2000,
      position: 'bottom',
      icon: checkmarkCircle
    })
  }

  const foundFile = upload
  // const foundFile =
  //   hasFiles && match && uploadedFiles.find((u) => u.cid === match.params.id)

  const fileContent = foundFile && (
    <>
      {showQR
        ? (
        <div className="durin-qr">
          <QRCode value={transformForShare(foundFile.url)} />
        </div>
          )
        : <div className="durin-square-img">
          {foundFile.thumbnail
            ? (
            <IonImg
              src={`https://ipfs.io/ipfs/${foundFile.cid}/${foundFile.name}`}
              alt={foundFile.extension}
              className="durin-image-preview"
            />
              )
            : (
            <FileIcon extension={foundFile.extension} />
              )}
        </div>
      }

      <div className="durin-file-view">
        <h2 className="durin-file_name">{foundFile.name}</h2>
        <IonLabel className="durin-label">File URL:</IonLabel>
        <p>
          <a className="durin-file_url" href={foundFile.url}>
            {transformForShare(foundFile.url)}
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
        <IonButton className="durin-button-alt" expand="block" size="small" onClick={() => copyCID(foundFile.cid)}>
          Copy CID
        </IonButton>

        <IonButton className="durin-button-alt" expand="block" size="small" onClick={() => setShowQR(!showQR)}>
          {!showQR ? 'Show' : 'Hide'} QR Code
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
          <IonTitle>
            <IonLabel className="durin-label ion-text-center">Share</IonLabel>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton color="light" onClick={() => onDismiss(null, 'cancel')}>
              <IonIcon icon={closeOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <PageContainer>
        <div className="durin-page-container flex-col">
          {fileContent}
        </div>
      </PageContainer>
    </IonPage>
  )
}

export default File
