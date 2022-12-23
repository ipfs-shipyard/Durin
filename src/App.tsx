import { Redirect, Route } from "react-router-dom"
import { useEffect } from "react"
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react"
import { IonReactRouter } from "@ionic/react-router"
import {
  searchOutline,
  cloudUploadOutline,
  settingsOutline,
  listOutline,
} from "ionicons/icons"
import { SplashScreen } from "@capacitor/splash-screen"
import Browse from "./pages/Browse"
import Share from "./pages/Share"
import Settings from "./pages/Settings"
import Files from "./pages/Files"
import File from "./pages/File"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"

/* Theme variables */
import "./theme/variables.css"
import "./app.scss"

setupIonicReact({
  mode: "ios",
})

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/view">
              <Browse />
            </Route>
            <Route exact path="/files">
              <Files />
            </Route>
            <Route path="/files/:id" component={File} />
            <Route exact path="/share">
              <Share />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/view" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="view" href="/view">
              <IonIcon icon={searchOutline} />
            </IonTabButton>
            <IonTabButton tab="share" href="/share">
              <IonIcon icon={cloudUploadOutline} />
            </IonTabButton>
            <IonTabButton tab="files" href="/files">
              <IonIcon icon={listOutline} />
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settingsOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
