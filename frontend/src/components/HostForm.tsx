import {Host, hostsSelector, setHosts} from "../reducers/hosts"
import {useAppDispatch, useAppSelector} from "../store"
import {useEffect, useState} from "react"
import {IonButton, IonCard, IonInput, IonText} from "@ionic/react"
import {saveHostsToStorage} from "../storage/hosts"

interface HostFormProps {
  index?: number
  mode: "add" | "edit" | "select" | "delete"
}

export const HostForm = (props: HostFormProps) => {
  const dispatch = useAppDispatch()
  const hosts = useAppSelector(hostsSelector)

  const getHost = () => {
    if(props.index == undefined || props.index === -1) {
      return {address: "", password: ""}
    } else {
      return hosts.hosts[props.index]
    }
  }

  const [host, setHost] = useState<Host>(getHost())

  useEffect(() => {
    if (props.mode === "edit" || props.mode === "delete")
      setHost(getHost())
    else if (props.mode === "add")
      setHost({address: "", password: ""})
  }, [props.index, props.mode])

  const handleChange = (name) => (e) => {
    setHost({...host, [name]: e.detail.value})
  }

  const handleSubmit = (e) => {
    const hosts2 = {
      hosts: [...hosts.hosts]
    }
    if(props.mode === "add") {
      hosts2.hosts.push(host)
    } else if(props.mode === "edit") {
      hosts2.hosts[props.index] = host
    }
    else if(props.mode === "delete") {
      if(props.index != undefined && props.index !== -1)
        hosts2.hosts.splice(props.index, 1)
    }
    // @ts-ignore
    dispatch(setHosts(hosts2))
    saveHostsToStorage(hosts2)
      .then(r => console.log("Saved hosts"))
      .catch(err => console.error("Error saving hosts", err))
  }

  if (props.mode === "select")
    return null

  return (
    // use ionic input components
    <IonCard style={{margin: 10, padding: 10}}>
      <IonText style={{fontSize: '1.5em'}}>
        {props.mode[0].toUpperCase() + props.mode.slice(1) + " Host"}
      </IonText>
      <IonInput
        name="address"
        value={host.address}
        onIonChange={handleChange("address")}
        placeholder="Address"
      />
      <IonInput
        name="password"
        value={host.password}
        onIonChange={handleChange("password")}
        placeholder="Password"
      />
      <IonButton onClick={handleSubmit}>Submit</IonButton>
    </IonCard>
  )
}