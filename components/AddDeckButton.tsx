import React from "react"
import { useContext } from "react"
import { Pressable } from "react-native"
import { DeckContext } from "../contexts/DeckContext"
import { Text } from "./Themed"

export const AddDeckButton = () => {
  const { addDeck, decks, loading } = useContext(DeckContext)

  const title = loading ? "Loading ..." : `New game (${decks.length})`

  return (
    <Pressable onPress={addDeck} disabled={loading}>
      <Text>{title}</Text>
    </Pressable>
  )
}
