import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Pressable, StyleSheet } from "react-native"
import { Deck } from "../types"
import { View, Text } from "./Themed"

export const CurrentGame: React.FC<{ deck: Deck }> = ({ deck }) => {
  const navigation = useNavigation()

  const closeGame = () => {
    navigation.setParams({ deck: undefined })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deck {deck.deck_id}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Pressable onPress={closeGame}>
        <Text style={styles.title}>Close game</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
