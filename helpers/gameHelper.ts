import { Card } from "../types"

export const calculateScore = (cards: Card[]) => {
  const valuesInHand = cards.map((card) => {
    switch (card.value) {
      case "ACE":
        return 1
      case "JACK":
      case "QUEEN":
      case "KING":
      case "JACK":
        return 10
      default:
        return parseInt(card.value)
    }
  })

  if (valuesInHand.length < 1) return 0

  return valuesInHand.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  )
}
