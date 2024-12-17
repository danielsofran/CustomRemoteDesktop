import {useState, useEffect, useRef} from "react"
import {useAppSelector} from "./store"
import {preferencesSelector} from "./reducers/preferences"

interface useServerSocketProps {
  onOpen?: (ws?: WebSocket) => void
  onClose?: (ws?: WebSocket) => void
  onMessage?: (event: MessageEvent) => void
  reconnectOnClose?: boolean
}

export const useServerSocket = (props?: useServerSocketProps) => {
  const preferences = useAppSelector(preferencesSelector)
  const ws = useRef<any>(null) // will be created each time, unfortunately

  const init = () => {
    ws.current = new WebSocket(preferences.host.address, ["json", `token-${preferences.host.password}`])
    ws.current.onopen = () => {
      console.log("Connected")
      props?.onOpen?.(ws.current)
    }
    ws.current.onclose = () => {
      console.log("Disconnected")
      props?.onClose?.(ws.current)
      if (props?.reconnectOnClose)
        init() // infinite recursion, and host is not updated
    }
    ws.current.onmessage = (event) => {
      console.log("Message received: ", event)
      props?.onMessage?.(event.data)
    }
  }

  useEffect(() => {
    init()
    return () => ws.current.close()
  }, [preferences.host])

  const send = (data: any) => {
    if (ws.current.readyState === WebSocket.OPEN)
      ws.current.send(JSON.stringify(data))
    else
      throw new Error("Websocket not open")
  }

  return {send}
}

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkPalette = (shouldAdd: boolean) => {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd)
  }

  const initializeDarkPalette = (isDark: boolean) => {
    setIsDarkMode(isDark)
    toggleDarkPalette(isDark)
  }

  const toggleChange = () => {
    toggleDarkPalette(!isDarkMode)
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    //initializeDarkPalette(prefersDark.matches)

    const setDarkPaletteFromMediaQuery = (mediaQuery: MediaQueryListEvent) => {
      initializeDarkPalette(mediaQuery.matches)
    }

    prefersDark.addEventListener('change', setDarkPaletteFromMediaQuery)

    return () => {
      prefersDark.removeEventListener('change', setDarkPaletteFromMediaQuery)
    }
  }, [])

  return { isDarkMode, toggleDarkMode: toggleChange }
}