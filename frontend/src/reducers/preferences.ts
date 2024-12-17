import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import {Host} from "./hosts"
import {savePreferencesToStorage} from "../storage/preferences"

export interface Preferences {
  sensitivity: number // float
  host: Host

  darkMode: boolean
  baseJoystickColor?: string
  stickJoystickColor?: string
}

export const initialPreferences = {
  sensitivity: 1,
  darkMode: true,
  host: {
    address: "ws://192.168.43.50:12550",
    password: "__Daniel__#3875",
  },
} as Preferences

const save = (state) => savePreferencesToStorage(state)
  .then(() => console.log("Preferences saved to storage"))
  .catch((err) => console.error("Error saving preferences to storage", err))

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState: initialPreferences,
  reducers: {
    setPreferences: (state, action: PayloadAction<Preferences>) => {
      if(!action.payload)
        return
      // return action.payload
      state.darkMode = action.payload.darkMode ?? state.darkMode
      state.sensitivity = action.payload.sensitivity ?? state.sensitivity
      state.host = action.payload.host ?? state.host
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    setSensitivity: (state, action: PayloadAction<number>) => {
      state.sensitivity = action.payload
    },
    setHost: (state, action: PayloadAction<Host>) => {
      state.host = action.payload
    }
  }
})

export const {setPreferences, setDarkMode, setSensitivity, setHost} = preferencesSlice.actions
export default preferencesSlice.reducer
export const preferencesSelector = (state: RootState): Preferences => state.preferences