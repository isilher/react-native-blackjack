import { useRoute } from "@react-navigation/native"
import * as React from "react"
import { StyleSheet } from "react-native"
import { AddDeckButton } from "../components/AddDeckButton"
import { CurrentGame } from "../components/CurrentGame"

import EditScreenInfo from "../components/EditScreenInfo"
import { EmptyGame } from "../components/EmptyGame"
import { Text, View } from "../components/Themed"
import { Deck } from "../types"

export default function TabTwoScreen() {
  const route = useRoute()

  const deck: Deck | undefined = route.params?.deck

  if (!deck) return <EmptyGame />

  return <CurrentGame deck={deck} />
}
