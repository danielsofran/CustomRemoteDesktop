import {Preferences} from "@capacitor/preferences"
import {Hosts} from "../reducers/hosts"

export const getHostsFromStorage = async (): Promise<Hosts> => {
  return await Preferences.get({ key: 'hosts' }).then(data => {
    if (!data.value)
      throw new Error('Hosts not found')
    return JSON.parse(data.value)
  })
}

export const saveHostsToStorage = async (data: any) => {
  await Preferences.set({ key: 'hosts', value: JSON.stringify(data) })
}

export const clearHostsFromStorage = async () => {
  await Preferences.remove({ key: 'hosts' })
}