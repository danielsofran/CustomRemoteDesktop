import {IonButton, IonCheckbox, IonContent, IonHeader, IonInput, IonPage, IonRange, IonText, IonTextarea, IonTitle, IonToolbar} from "@ionic/react"

import {useServerSocket} from "../hooks"
import {useState} from "react"

const VolumePage: React.FC = () => {
  const {send} = useServerSocket()

  const [volume, setVolume] = useState(0)
  const [muted, setMuted] = useState(false)
  const [brightness, setBrightness] = useState(0)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Volume</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Volume</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRange
          label="Volume"
          min={0}
          max={100}
          pin={true}
          value={volume}
          onIonChange={e => {
            setVolume(e.detail.value as number)
            send({type: "volume", volume: e.detail.value as number})
          }}
        />
        <IonCheckbox
          style={{marginTop: 20}}
          checked={muted}
          onIonChange={e => {
            setMuted(e.detail.checked)
            send({type: "volume", muted: e.detail.checked})
          }}
        >
          Muted
        </IonCheckbox>
        <IonRange
          label="Brightness"
          min={0}
          max={100}
          pin={true}
          value={brightness}
          onIonChange={e => {
            setBrightness(e.detail.value as number)
            send({type: "light", brightness: e.detail.value as number})
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default VolumePage;
