import {IonButton, IonCheckbox, IonContent, IonHeader, IonInput, IonPage, IonText, IonTextarea, IonTitle, IonToolbar} from "@ionic/react"
import {useServerSocket} from "../hooks"
import {useState} from "react"

const KeyboardPage: React.FC = () => {
  const {send} = useServerSocket()

  const [key, setKey] = useState("")
  const [text, setText] = useState("")

  const [modifiers, setModifiers] = useState({
    shift: false,
    alt: false,
    control: false,
    command: false
  })

  const collectModifiers = () => {
    return Object.keys(modifiers).filter(key => modifiers[key])
  }

  const onTextChange = (e: any) => {
    send({type: "text", text: e.detail.value})
  }

  const onKeyChange = (e: any) => {
    if (e.detail.value.length === 0) {
      setKey("")
      return
    }
    const key = e.detail.value[e.detail.value.length - 1]
    setKey(key)
    send({type: "keypress", key, modifiers: collectModifiers()})
  }

  const clear = () => {
    setKey("")
    setText("")
  }

  // not working in robot js
  const backspace = () => {
    send({type: "keypress", key: "backspace"})
  }

  const enter = () => {
    send({type: "keypress", key: "enter"})
  }

  const tab = () => {
    send({type: "keypress", key: "tab"})
  }

  const ctrlc = () => {
    send({type: "keypress", key: "c", modifiers: ["control"]})
  }

  const ctrlv = () => {
    send({type: "keypress", key: "v", modifiers: ["control"]})
  }

  const ctrlx = () => {
    send({type: "keypress", key: "x", modifiers: ["control"]})
  }

  const ctrlz = () => {
    send({type: "keypress", key: "z", modifiers: ["control"]})
  }

  const ctrly = () => {
    send({type: "keypress", key: "y", modifiers: ["control"]})
  }

  const ctrla = () => {
    send({type: "keypress", key: "a", modifiers: ["control"]})
  }

  const ckStyle = {
    border: "1px solid aqua",
    borderRadius: "10%",
    padding: "5px"
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Keyboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Keyboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 10}}>
          <IonCheckbox style={ckStyle} checked={modifiers.shift} onIonChange={e => setModifiers({...modifiers, shift: e.detail.checked})}>Shift</IonCheckbox>
          <IonCheckbox style={ckStyle} checked={modifiers.alt} onIonChange={e => setModifiers({...modifiers, alt: e.detail.checked})}>Alt</IonCheckbox>
          <IonCheckbox style={ckStyle} checked={modifiers.control} onIonChange={e => setModifiers({...modifiers, control: e.detail.checked})}>Ctrl</IonCheckbox>
          <IonCheckbox style={ckStyle} checked={modifiers.command} onIonChange={e => setModifiers({...modifiers, command: e.detail.checked})}>Win</IonCheckbox>
        </div>
        <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 10}}>
          <IonButton onClick={backspace}>Backspace</IonButton>
          <IonButton onClick={enter}>Enter</IonButton>
          <IonButton onClick={tab}>Tab</IonButton>
        </div>
        <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 10}}>
          <IonButton onClick={ctrlc}>Ctrl+C</IonButton>
          <IonButton onClick={ctrlv}>Ctrl+V</IonButton>
          <IonButton onClick={ctrlx}>Ctrl+X</IonButton>
        </div>
        <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 10}}>
          <IonButton onClick={ctrlz}>Ctrl+Z</IonButton>
          <IonButton onClick={ctrly}>Ctrl+Y</IonButton>
          <IonButton onClick={ctrla}>Ctrl+A</IonButton>
        </div>
        <IonInput
          label="Key"
          value={key}
          placeholder="Type here..."
          autofocus={true}
          onIonInput={onKeyChange}
        />
        <IonTextarea
          label="Text"
          value={text}
          placeholder="Type here..."
          autoGrow={true}
          onIonChange={onTextChange}
        />
        <div style={{display: "flex", justifyContent: "space-around", alignItems: "center", marginTop: 10}}>
          <IonButton onClick={clear}>
            Clear
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default KeyboardPage;
