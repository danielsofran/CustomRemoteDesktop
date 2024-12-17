import {IonAlert, IonButton, IonContent, IonHeader, IonPage, IonRange, IonTitle, IonToolbar} from "@ionic/react"
import {Joystick} from "react-joystick-component"
import {useEffect, useRef, useState} from "react"
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick"
import {useServerSocket} from "../hooks"
import {useAppDispatch, useAppSelector} from "../store"
import {preferencesSelector, setSensitivity as setReduxSensitivity} from "../reducers/preferences"
import {savePreferencesToStorage} from "../storage/preferences"

const dvwToPx = (dvw: number) => dvw * Math.min(window.innerWidth, window.innerHeight) / 100

const MousePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const preferences = useAppSelector(preferencesSelector)
  const {send} = useServerSocket({
    // reconnectOnClose: true,
    onClose: (ws) => {
      // setAlertMessage("Connection to server lost")
      // const location = window.location.href
      // setAlertOpen(location.includes("mouse") || location.includes("keyboard"))
    }
  })
  const mouseState = useRef<"up"|"down">("up")

  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [lastButton, setLastButton] = useState<"left"|"right">("left")

  const move = (ev: IJoystickUpdateEvent) => {
    send({type: "mousemove", x: ev.x! * preferences.sensitivity, y: -(ev.y!) * preferences.sensitivity})
  }

  const onMouseClick = (button: "left" | "right") => {
    send({type: "mouseclick", button})
    setLastButton(button)
  }

  const onMouseToggle = () => {
    mouseState.current = mouseState.current === "up" ? "down" : "up"
    send({type: "mousestate", button: lastButton, state: mouseState.current})
  }

  const onSensitiveChange = (ev: any) => {
    // @ts-ignore
    dispatch(setReduxSensitivity(ev.detail.value as number))
    savePreferencesToStorage({...preferences, sensitivity: ev.detail.value as number})
      .then(r => console.log("Saved preferences"))
      .catch(err => console.error("Error saving preferences", err))
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mouse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mouse</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/*CODE HERE*/}
        <div style={{marginTop: 20, display: "flex", gap: 10, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100dvw"}}>
          <Joystick
            size={dvwToPx(80)}
            stickSize={dvwToPx(10)}
            move={move}

          />
          <div style={{display: "flex", alignItems: "center", gap: 20 }}>
            <IonButton style={{fontSize: "1.5em"}} onClick={() => onMouseClick('left')}>LMB</IonButton>
            <IonButton style={{fontSize: "1.5em"}} onClick={() => onMouseClick('right')}>RMB</IonButton>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 20 }}>
            <h1>{lastButton}</h1>
            <IonButton style={{fontSize: "1.5em"}} onClick={() => onMouseToggle()}>Toggle</IonButton>
          </div>
          <div style={{width: "80dvw"}}>
            <IonRange
              label="Sensitivity"
              min={1}
              max={50}
              step={0.1}
              pin={true}
              pinFormatter={value => `${value}x`}
              value={preferences.sensitivity}
              onIonChange={onSensitiveChange}
            />
          </div>
        </div>
        <IonAlert
          isOpen={alertOpen}
          onDidDismiss={() => setAlertOpen(false)}
          header={'Alert'}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default MousePage;
