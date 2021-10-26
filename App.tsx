import "react-native-gesture-handler"
import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as Notifications from "expo-notifications"

import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import { Provider } from "react-redux"
import { gameStore } from "./reducers/gameReducer"

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  // Register handler for (local) push notifications
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    })
  }, [])

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <Provider store={gameStore}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    )
  }
}
