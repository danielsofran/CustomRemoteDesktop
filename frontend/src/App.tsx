import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import MousePage from './pages/MousePage';
import KeyboardPage from './pages/KeyboardPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
import '@ionic/react/css/palettes/dark.class.css';
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import {useEffect} from "react"
import {useDarkMode} from "./hooks"
import {useAppDispatch} from "./store"
import {getPreferencesFromStorage, savePreferencesToStorage} from "./storage/preferences"
import {initialPreferences, setPreferences} from "./reducers/preferences"
import {getHostsFromStorage} from "./storage/hosts"
import {setHosts} from "./reducers/hosts"
import {SettingsPage} from "./pages/SettingsPage"

setupIonicReact();

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  useEffect(() => {
    getPreferencesFromStorage().then((preferences) => {
      if(preferences.darkMode !== isDarkMode) {
        toggleDarkMode()
        setTimeout(() => {
          toggleDarkMode()
        }, 1000)
      }
      // @ts-ignore
      dispatch(setPreferences(preferences))
    }).catch((err) => {
      console.error("Error fetching preferences", err)
      // @ts-ignore
      dispatch(setPreferences(initialPreferences))
    })

    getHostsFromStorage().then((hosts) => {
      console.log("Hosts", hosts)
      // @ts-ignore
      dispatch(setHosts(hosts))
    }).catch((err) => {
      console.error("Error fetching hosts", err)
    })
  }, [])

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/mouse">
              <MousePage/>
            </Route>
            <Route exact path="/keyboard">
              <KeyboardPage/>
            </Route>
            <Route exact path="/settings">
              <SettingsPage/>
            </Route>
            <Route exact path="/">
              <Redirect to="/mouse"/>
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="mouse" href="/mouse">
              {/*<IonIcon aria-hidden="true" icon={triangle} />*/}
              <h5>Mouse</h5>
            </IonTabButton>
            <IonTabButton tab="keyboard" href="/keyboard">
              {/*<IonIcon aria-hidden="true" icon={ellipse} />*/}
              <h5>Keyboard</h5>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              {/*<IonIcon aria-hidden="true" icon={square} />*/}
              <h5>Settings</h5>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  )
}

export default App;
