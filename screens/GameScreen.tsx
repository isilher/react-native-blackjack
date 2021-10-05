import { useRoute } from "@react-navigation/native"
import * as React from "react"
import { useSelector } from "react-redux"
import { CurrentGame } from "../components/CurrentGame"

import { EmptyGame } from "../components/EmptyGame"
import { selectDeck } from "../reducers/gameReducer"

export default function GameScreen() {
  const deck = useSelector(selectDeck)

  if (!deck) return <EmptyGame />

  return <CurrentGame deck={deck} />
}
