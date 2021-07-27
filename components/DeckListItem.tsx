import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Dimensions, Pressable } from "react-native"
import { StyleSheet } from "react-native"
import { Deck } from "../types"
import { View, Text } from "./Themed"

export const DeckListItem: React.FC<{ deck: Deck }> = ({ deck }) => {
  const { navigate } = useNavigation()

  const navigateToGame = () => {
    navigate("TabTwo", { screen: "TabTwoScreen", params: { deck } })
  }
  return (
    <Pressable style={styles.container} onPress={navigateToGame}>
      <Text>{deck.deck_id}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: Dimensions.get("window")["width"],
    borderBottomColor: "green",
    borderBottomWidth: 1,
  },
})
