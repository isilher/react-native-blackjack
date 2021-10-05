import { useRoute } from "@react-navigation/native"
import * as React from "react"
import { CurrentGame } from "../components/CurrentGame"

import { EmptyGame } from "../components/EmptyGame"
import { gameStore } from "../reducers/gameReducer"
import { Deck } from "../types"

export default function GameScreen() {
  const route = useRoute()

  const deck: Deck | undefined = route.params?.deck

  if (!deck) return <EmptyGame />

  return <CurrentGame deck={deck} />
}
