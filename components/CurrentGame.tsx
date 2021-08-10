import { useNavigation } from "@react-navigation/native"
import React, { useMemo, useState } from "react"
import { useCallback } from "react"
import { useEffect } from "react"
import { Alert, Image } from "react-native"
import { Pressable, StyleSheet } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { calculateScore } from "../helpers/gameHelper"
import { Card, Deck } from "../types"
import { View, Text } from "./Themed"

export const CurrentGame: React.FC<{ deck: Deck }> = ({ deck }) => {
  const navigation = useNavigation()
  const [cardsInHand, setCardsInHand] = useState<Card[]>([])
  const [houseCards, setHouseCards] = useState<Card[]>([])
  const gameStarted = cardsInHand.length > 0

  const bust = useMemo(() => calculateScore(cardsInHand) > 21, [cardsInHand])
  const [gameEnded, setGameEnded] = useState(false)

  const closeGame = () => {
    navigation.setParams({ deck: undefined })
  }

  const startNewGame = async () => {
    // if not, shuffle the deck
    await fetch(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)

    // and draw two cards for the player
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=4`
    )
    const { cards } = await response.json()

    // add cards to player hand
    setCardsInHand([cards[0], cards[1]])
    setHouseCards([cards[2], cards[3]])
  }

  const drawCard = async (params?: { house: boolean }) => {
    // TODO:  check if the game is in a loading state

    // TODO: return when the game was lost

    // fetch a new card
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    )
    const { cards } = await response.json()

    if (params?.house) {
      // add it to the current state
      setHouseCards((currentState) => {
        return [...currentState, cards[0]]
      })
    } else {
      // add it to the current state
      setCardsInHand((currentState) => {
        return [...currentState, cards[0]]
      })
    }
  }

  const resolveHouse = async () => {
    console.log("START")
    setGameEnded(true)
  }

  useEffect(() => {
    if (!gameEnded) return
    if (calculateScore(houseCards) >= 17) return

    drawCard({ house: true })
  }, [gameEnded, houseCards])

  useEffect(() => {
    const showAlert = () => {
      // Disabled in development
      // Alert.alert("♥️♠️ Your game starts NOW!")
    }

    const timer = setTimeout(showAlert, 4000)

    return () => {
      clearTimeout(timer)
    }
  }, [deck])

  const keyExtractor = useCallback((item, index) => item.code + index, [])

  const renderPlayerCard = useCallback(
    ({ item }) => (
      <Image
        resizeMode="contain"
        source={{ uri: item.image }}
        style={styles.cardImage}
      />
    ),
    []
  )

  const renderHouseCard = useCallback(
    ({ item, index }) => (
      <Image
        resizeMode="contain"
        source={{
          uri:
            index === 0 || bust || gameEnded
              ? item.image
              : "https://playingcardstop1000.com/wp-content/uploads/2018/09/PlayingCardsTop1000-Rokoko-romi-Hungary-Card-back.jpg",
        }}
        style={styles.cardImage}
      />
    ),
    [bust]
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deck {deck.deck_id}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text>HOUSE</Text>
      <View style={styles.cardsContainer}>
        <FlatList
          horizontal
          data={houseCards}
          renderItem={renderHouseCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.handListContentContainer}
        />
      </View>
      <Text>Score: {bust || gameEnded ? calculateScore(houseCards) : "?"}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text>PLAYER</Text>
      <View style={styles.cardsContainer}>
        <FlatList
          horizontal
          data={cardsInHand}
          renderItem={renderPlayerCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.handListContentContainer}
        />
      </View>
      <Text>Score: {calculateScore(cardsInHand)}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {gameStarted && !bust && (
        <Pressable onPress={() => drawCard()}>
          <Text style={styles.title}>Gimme a card!</Text>
        </Pressable>
      )}

      {gameStarted && !bust && (
        <Pressable onPress={resolveHouse}>
          <Text style={styles.title}>Show em!</Text>
        </Pressable>
      )}

      {gameStarted && bust && <Text style={styles.title}>BUST!</Text>}

      {gameStarted && bust && (
        <Pressable onPress={startNewGame}>
          <Text style={styles.title}>Restart game</Text>
        </Pressable>
      )}

      {!gameStarted && (
        <Pressable onPress={startNewGame}>
          <Text style={styles.title}>Start game</Text>
        </Pressable>
      )}

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
  cardsContainer: {
    backgroundColor: "green",
    flexDirection: "row",
  },
  handListContentContainer: {
    minWidth: "100%",
    justifyContent: "center",
  },
  cardImage: {
    height: 180,
    marginHorizontal: 10,
    width: 120,
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
