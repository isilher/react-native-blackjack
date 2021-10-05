import { Deck, Card } from "../types"

export const apiShuffleDeck = async (deck_id: Deck["deck_id"]) => {
  await fetch(`http://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`)
}

export const apiDrawCards = async (deck_id: Deck["deck_id"], count: number) => {
  const response = await fetch(
    `http://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${count}`
  )

  const { cards } = await response.json()
  return cards as Card[]
}
