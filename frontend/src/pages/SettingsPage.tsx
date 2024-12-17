import {useAppDispatch, useAppSelector} from "../store"
import {preferencesSelector, setHost} from "../reducers/preferences"
import {useDarkMode} from "../hooks"
import {useEffect, useState} from "react"
import {setDarkMode as setDarkModeRedux, setPreferences} from "../reducers/preferences"
import {IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRadio, IonRadioGroup, IonText, IonTitle, IonToggle, IonToolbar} from "@ionic/react"
import {hostsSelector} from "../reducers/hosts"
import {HostForm} from "../components/HostForm"
import {arrowForward, checkmarkCircle, create} from "ionicons/icons"
import {savePreferencesToStorage} from "../storage/preferences"

export const SettingsPage = () => {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(preferencesSelector)
  const hosts = useAppSelector(hostsSelector)
  const {isDarkMode, toggleDarkMode} = useDarkMode()

  const [selectedHostIndex, setSelectedHostIndex] = useState<number>(-1)
  const [hostMode, setHostMode] = useState<"add"|"edit"|"select"|"delete">("select")

  useEffect(() => {
    if (hostMode == "select" && selectedHostIndex !== -1) {
      // @ts-ignore
      dispatch(setHost(hosts.hosts[selectedHostIndex]))
      savePreferencesToStorage({...preferences, host: hosts.hosts[selectedHostIndex]})
        .then(r => console.log("Saved preferences"))
        .catch(err => console.error("Error saving preferences", err))
    }
  }, [selectedHostIndex])

  const setDarkMode = (darkMode: boolean) => {
    if(darkMode !== isDarkMode) {
      toggleDarkMode()
    }
    // @ts-ignore
    dispatch(setDarkModeRedux(darkMode))
    savePreferencesToStorage({...preferences, darkMode})
      .then(r => console.log("Saved preferences"))
      .catch(err => console.error("Error saving preferences", err))
  }

  const setPreference = (key: string, value: any) => {
    const newPreferences = {...preferences, [key]: value}
    // @ts-ignore
    dispatch(setPreferences(newPreferences))
    savePreferencesToStorage(newPreferences)
      .then(r => console.log("Saved preferences"))
      .catch(err => console.error("Error saving preferences", err))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonListHeader style={{fontSize: '1.5em'}}>
          Hosts
        </IonListHeader>
        <IonRadioGroup value={hostMode} onIonChange={(e) => setHostMode(e.detail.value)} style={{display: 'flex', justifyContent: 'space-around'}}>
          <IonRadio value="add">Add</IonRadio>
          <IonRadio value="edit">Edit</IonRadio>
        </IonRadioGroup>
        <IonRadioGroup value={hostMode} onIonChange={(e) => setHostMode(e.detail.value)} style={{display: 'flex', justifyContent: 'space-around', marginTop: 20}}>
          <IonRadio value="delete">Delete</IonRadio>
          <IonRadio value="select">Select</IonRadio>
        </IonRadioGroup>
        <IonList inset>
          {hosts.hosts.map((host, index) => (
            <IonItem key={host.address} onClick={() => setSelectedHostIndex(index)}>
              {host.address === preferences.host?.address && hostMode === "select" &&
                <IonIcon icon={checkmarkCircle} color="success" style={{marginRight: 10}} slot="start"/>
              }
              {selectedHostIndex >= 0 && host.address === hosts.hosts[selectedHostIndex]?.address && (hostMode === "edit" || hostMode === "delete") &&
								<IonIcon icon={arrowForward} color="primary" style={{marginRight: 10}} slot="start"/>
              }
              <IonLabel>{host.address}</IonLabel>
              <IonLabel>{host.password}</IonLabel>
            </IonItem>
          ))}
        </IonList>
        <HostForm index={selectedHostIndex} mode={hostMode}/>
        <IonListHeader style={{fontSize: '1.5em'}}> Aspect </IonListHeader>
        <IonList inset>
          <IonItem>
            <IonToggle
              checked={preferences.darkMode}
              onIonChange={(e) => setDarkMode(e.detail.checked)}
              justify="space-between"
            >
              Dark Mode
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  )
}