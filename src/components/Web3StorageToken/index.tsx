import { FC } from 'react'
import './index.scss'
import { IonInput } from '@ionic/react'
import createPersistedState from 'use-persisted-state'
import { SettingsObject } from '../../util/ipfs'

const Web3StorageToken: FC = () => {
  const useSettings = createPersistedState<SettingsObject>('durin-settings')
  const [settings, setSettings] = useSettings({
    node: 'auto',
    web3storageToken: ''
  })

  return (
    <IonInput
      type='text'
      placeholder='Web3.Storage Token'
      value={settings.web3storageToken}
      className='durin-input'
      required
      onIonChange={(e) => setSettings({
        ...settings,
        web3storageToken: e.detail.value!
      })}
    />
  )
}

export default Web3StorageToken
