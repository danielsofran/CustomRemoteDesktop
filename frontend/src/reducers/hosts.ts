import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import {saveHostsToStorage} from "../storage/hosts"

export interface Host {
  address: string
  password?: string
}

export interface Hosts {
  hosts: Host[]
}

export const initialHosts = {
  hosts: [
    {
      address: "ws://192.168.43.50:12550",
      password: "__Daniel__#3875",
    },
  ]
} as Hosts

const findHost = (hosts: Host[], host: Host) => {
  return hosts.findIndex(h => h.address === host.address && h.password === host.password)
}

const save = (state) => saveHostsToStorage(state)
  .then(() => console.log("Hosts saved to storage"))
  .catch((err) => console.error("Error saving hosts to storage", err))

export const hostsSlice = createSlice({
  name: "hosts",
  initialState: initialHosts,
  reducers: {
    setHosts: (state, action: PayloadAction<Hosts>) => {
      if(!action.payload)
        return
      // return action.payload
      state.hosts = action.payload.hosts ?? state.hosts
    },
    addHost: (state, action: PayloadAction<Host>) => {
      state.hosts.push(action.payload)
      return state
    },
    removeHost: (state, action: PayloadAction<Host>) => {
      const index = findHost(state.hosts, action.payload)
      if(index >= 0) {
        state.hosts.splice(index, 1)
      }
    },
    updateHost: (state, action: PayloadAction<Host>) => {
      const index = findHost(state.hosts, action.payload)
      if(index >= 0) {
        state.hosts[index] = action.payload
      }
    }
  }
})

export const {setHosts, addHost, removeHost, updateHost} = hostsSlice.actions
export default hostsSlice.reducer
export const hostsSelector = (state: RootState): Hosts => state.hosts