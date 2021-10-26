import React, { useState } from "react"
import { Deck, DeckState } from "../types"
import * as Notifications from "expo-notifications"
import { Alert, Linking } from "react-native"

export const DeckContext = React.createContext<DeckState>({
  decks: [],
  addDeck: () => null,
  loading: false,
})

export const DeckProvider: React.FC = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const addDeck = (deck: Deck) => {
    setDecks((currentState) => {
      return [...currentState, deck]
    })
  }

  const addNewDeck = async () => {
    try {
      setLoading(true)
      // Fetch
      const response = await fetch(
        "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
      )
      const newDeck = (await response.json()) as Deck

      const permissionResult = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowAnnouncements: true,
        },
      })

      if (!permissionResult.granted)
        Alert.alert(
          "You didn`t choose to enable notifications, you might miss your game!"
        )

      setTimeout(() => {
        addDeck(newDeck)
        setLoading(false)
      }, 5000)

      const url = await Linking.getInitialURL()
      const baseUrl = url?.split("/--")[0]

      Notifications.scheduleNotificationAsync({
        content: {
          title: "Your game has started!",
          body: "Click to start playing now.",
          data: {
            url: `${baseUrl}/--/gameTab`,
            deck: newDeck,
          },
          categoryIdentifier: "newGameReady",
        },
        trigger: {
          seconds: 5,
        },
      })

      Notifications.setNotificationCategoryAsync("newGameReady", [
        { identifier: "autostart", buttonTitle: "Letsgo!" },
      ])

      // Add
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  return (
    <DeckContext.Provider value={{ decks, addDeck: addNewDeck, loading }}>
      {children}
    </DeckContext.Provider>
  )
}
