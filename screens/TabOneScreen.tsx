import React, { useContext } from "react"
import { useCallback } from "react"
import { StyleSheet } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { DeckListItem } from "../components/DeckListItem"

import { Text, View } from "../components/Themed"
import { DeckContext } from "../contexts/DeckContext"
import { Deck } from "../types"

const TabOneScreen = () => {
  const { decks } = useContext(DeckContext)

  const renderItem = useCallback(({ item }) => <DeckListItem deck={item} />, [])
  const keyExtractor = useCallback((item: Deck) => item.deck_id, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Games</Text>
      <FlatList
        style={styles.list}
        data={decks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
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
  list: {
    flex: 1,
  },
})

export default TabOneScreen
