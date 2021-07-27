import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import { useEffect } from "react"
import { Alert, Image } from "react-native"
import { Pressable, StyleSheet } from "react-native"
import { Deck } from "../types"
import { View, Text } from "./Themed"

export const CurrentGame: React.FC<{ deck: Deck }> = ({ deck }) => {
  const navigation = useNavigation()
  const [cardsInHand, setCardsInHand] = useState([])
  const gameStarted = cardsInHand.length > 0

  const closeGame = () => {
    navigation.setParams({ deck: undefined })
  }

  const startGame = async () => {
    // if it has, do nothing
    if (gameStarted) return Alert.alert("already started!")

    // if not, shuffle the deck
    await fetch(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)

    // and draw two cards
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`
    )
    const { cards } = await response.json()

    // add cards to player hand
    setCardsInHand(cards)
    console.log(cards)
  }

  const drawCard = async () => {
    // TODO:  check if the game is in a loading state

    // TODO: return when the game was lost

    // fetch a new card
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    )
    const { cards } = await response.json()

    // add it to the current state
    setCardsInHand((currentState) => {
      return [...currentState, cards[0]]
    })
  }

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deck {deck.deck_id}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <View style={styles.cardsContainer}>
        {cardsInHand.map((card) => (
          <View>
            <Image
              resizeMode="contain"
              source={{ uri: card.image }}
              style={styles.cardImage}
            />
          </View>
        ))}
      </View>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {gameStarted && (
        <Pressable onPress={drawCard}>
          <Text style={styles.title}>Gimme a card!</Text>
        </Pressable>
      )}

      {!gameStarted && (
        <Pressable onPress={startGame}>
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

/**
 * NOTE this component is not in use.
 * It was used in lesson 8 to show the difference between a functional and a class component
 * and is comitted so those following the course can check out the code in detail if they wish
 */
export class CurrentGameAsClass extends React.Component<{
  deck: Deck
  navigation: unknown
}> {
  static timer: NodeJS.Timeout | undefined = undefined
  static currentDeck: Deck | undefined = undefined

  static showAlert = () => {
    Alert.alert("♥️♠️ Your game starts NOW!")
  }

  componentDidMount() {
    console.log("Mounted!")
    CurrentGameAsClass.timer = setTimeout(CurrentGameAsClass.showAlert, 4000)
  }

  componentWillUnmount() {
    if (CurrentGameAsClass.timer) {
      clearTimeout(CurrentGameAsClass.timer)
    }
  }

  static getDerivedStateFromProps(props) {
    if (
      !!CurrentGameAsClass.currentDeck &&
      props.deck !== CurrentGameAsClass.currentDeck
    ) {
      if (CurrentGameAsClass.timer) {
        clearTimeout(CurrentGameAsClass.timer)
      }
      CurrentGameAsClass.timer = setTimeout(CurrentGameAsClass.showAlert, 4000)
      CurrentGameAsClass.currentDeck = props.deck
    }

    return { ...props, id: props.deck.id }
  }

  render() {
    const closeGame = () => {
      this.props.navigation.setParams({ deck: undefined })
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Deck {this.props.deck.deck_id}</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Pressable onPress={this.closeGame}>
          <Text style={styles.title}>Close game</Text>
        </Pressable>
      </View>
    )
  }
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
  cardImage: {
    height: 180,
    margin: 10,
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
