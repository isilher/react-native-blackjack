import React, { useState } from "react"
import { Deck, DeckState } from "../types"

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

      // Add
      addDeck(newDeck)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <DeckContext.Provider value={{ decks, addDeck: addNewDeck, loading }}>
      {children}
    </DeckContext.Provider>
  )
}
