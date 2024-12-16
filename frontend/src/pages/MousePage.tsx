import {IonButton, IonCheckbox, IonContent, IonHeader, IonItemDivider, IonPage, IonRange, IonTitle, IonToolbar} from "@ionic/react"
import ExploreContainer from '../components/ExploreContainer';
import {Joystick} from "react-joystick-component"
import {useEffect, useRef, useState} from "react"
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick"

const dvwToPx = (dvw: number) => dvw * Math.min(window.innerWidth, window.innerHeight) / 100

const MousePage: React.FC = () => {
  const ws = useRef<any>(null)

  const [lastButton, setLastButton] = useState<"left"|"right">("left")
  const [sensitivity, setSensitivity] = useState(1)

  useEffect(() => {
    ws.current = new WebSocket(`ws://192.168.43.50:12550`, ["json", "token-__Daniel__#3875"])
    ws.current.onopen = () => console.log("Connected")
    ws.current.onclose = () => console.log("Disconnected")
    return () => ws.current.close()
  }, [])

  // useEffect(() => {
  //   if (!ws.current || ws.current.readyState !== WebSocket.OPEN){
  //     // reconnect
  //     ws.current = new WebSocket("ws://192.168.43.50:12550")
  //     ws.current.onopen = () => console.log("Connected")
  //     ws.current.onclose = () => console.log("Disconnected")
  //     return () => ws.current.close()
  //   }
  // }, [ws.current])

  const send = (data: Object) => {
    if (ws.current.readyState === WebSocket.OPEN)
      ws.current.send(JSON.stringify(data))
  }

  const move = (ev: IJoystickUpdateEvent) => {
    send({type: "mousemove", x: ev.x! * sensitivity, y: -(ev.y!) * sensitivity})
  }

  const onMouseClick = (button: "left" | "right") => {
    send({type: "mouseclick", button})
    setLastButton(button)
  }

  const onMouseToggle = () => {
    send({type: "mousestate", button: lastButton})
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
        <div style={{marginTop: 20, display: "flex", gap: 20, flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100dvw"}}>
          <Joystick
            size={dvwToPx(80)}
            stickSize={dvwToPx(10)}
            move={move}

          />
          <div style={{display: "flex", alignItems: "center", gap: 20 }}>
            <IonButton style={{fontSize: "2em"}} onClick={() => onMouseClick('left')}>LMB</IonButton>
            <IonButton style={{fontSize: "2em"}} onClick={() => onMouseClick('right')}>RMB</IonButton>
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
              value={sensitivity}
              onIonChange={ev => setSensitivity(ev.detail.value as number)}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MousePage;
