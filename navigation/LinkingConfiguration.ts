/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from "expo-linking"
import * as Notifications from "expo-notifications"
import { GAME_ACTION_TYPES } from "../reducers/gameActions"
import { gameStore } from "../reducers/gameReducer"

const link = "exp://172.18.1.64:19000/--/gameTab"

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              LobbyScreen: "one",
            },
          },
          TabTwo: {
            path: "gameTab",
            screens: {
              GameScreen: "two",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
  async getInitialURL() {
    // First, you may want to do the default deep link handling
    // Check if app was opened from a deep link
    let url = await Linking.getInitialURL()

    if (url != null) {
      return url
    }

    // Handle URL from expo push notifications
    const response = await Notifications.getLastNotificationResponseAsync()
    url = response?.notification.request.content.data.url

    return url
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url)

    // Listen to incoming links from deep linking
    Linking.addEventListener("url", onReceiveURL)

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { url, deck } = response.notification.request.content.data

        // Any custom logic to see whether the URL needs to be handled
        gameStore.dispatch({
          type: GAME_ACTION_TYPES.OPEN_GAME,
          payload: { deck },
        })

        // Let React Navigation handle the URL
        listener(url)
      }
    )

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener("url", onReceiveURL)
      subscription.remove()
    }
  },
}
