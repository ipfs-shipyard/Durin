import React from 'react'
import ReactDOM from 'react-dom'
import { App as NativeApp } from '@capacitor/app'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { open } from './util/ipfs'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

NativeApp.addListener('appUrlOpen', ({ url }) => {
  open(url)
})