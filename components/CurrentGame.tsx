import { useNavigation } from "@react-navigation/native"
import React, { useMemo, useState } from "react"
import { useReducer } from "react"
import { useCallback } from "react"
import { useEffect } from "react"
import { ActivityIndicator, Alert, Image } from "react-native"
import { Pressable, StyleSheet } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { calculateScore } from "../helpers/gameHelper"
import { Card, Deck } from "../types"
import { View, Text } from "./Themed"

const DEFAULT_GAME_STATE = {
  started: false,
  ended: false,
  loading: false,
  houseCards: [],
  playerCards: [],
  playerScore: 0,
  houseScore: 0,
}
type TGameState = {
  started: boolean
  ended: boolean
  houseCards: Card[]
  playerCards: Card[]
  loading: boolean
  playerScore: number
  houseScore: number
}

const GAME_ACTION_TYPES = {
  START: "start",
  END: "end",
  RESET: "reset",
  DRAW_SUCCESS: "drawSuccess",
} as const
type TGameActionTypeKey = keyof typeof GAME_ACTION_TYPES
type TGameActionType = typeof GAME_ACTION_TYPES[TGameActionTypeKey]
type TDrawSuccessPayload = { houseCards?: Card[]; playerCards?: Card[] }

function gameReducer(
  state: TGameState,
  action:
    | { type: Omit<TGameActionType, typeof GAME_ACTION_TYPES.DRAW_SUCCESS> }
    | {
        type: typeof GAME_ACTION_TYPES.DRAW_SUCCESS
        payload: { houseCards?: Card[]; playerCards?: Card[] }
      }
): TGameState {
  switch (action.type) {
    case GAME_ACTION_TYPES.START:
      return {
        ...state,
        started: true,
        ended: false,
        loading: true,
      }
    case GAME_ACTION_TYPES.DRAW_SUCCESS: {
      const { payload } = action as { payload: TDrawSuccessPayload }
      const newPlayerCards = [
        ...state.playerCards,
        ...(payload.playerCards ? payload.playerCards : []),
      ]
      const newHouseCards = [
        ...state.houseCards,
        ...(payload.houseCards ? payload.houseCards : []),
      ]
      const newPlayerScore = calculateScore(newPlayerCards)
      const newHouseScore = calculateScore(newHouseCards)

      console.log("🐙🐙", newHouseScore)

      return {
        ...state,
        loading: false,
        houseCards: newHouseCards,
        playerCards: newPlayerCards,
        houseScore: calculateScore(newHouseCards),
        playerScore: newPlayerScore,
        ended: newPlayerScore > 21,
      }
    }
    case GAME_ACTION_TYPES.END:
      return {
        ...state,
        ended: true,
      }
    case GAME_ACTION_TYPES.RESET:
      return {
        ...state,
        started: false,
        ended: false,
        houseCards: [],
        playerCards: [],
        loading: false,
        playerScore: 0,
        houseScore: 0,
      }
    default:
      console.log(
        "Something wrong: game reducer called with unknown action type: ",
        action.type
      )
      return state
  }
}

export const CurrentGame: React.FC<{ deck: Deck }> = ({ deck }) => {
  const navigation = useNavigation()

  const [gameState, dispatch] = useReducer(gameReducer, DEFAULT_GAME_STATE)
  const bust = gameState.playerScore > 21

  const closeGame = () => {
    navigation.setParams({ deck: undefined })
  }

  const startNewGame = async () => {
    // Prevent starting in an unready state
    if (gameState.started) return

    // Set the game state
    dispatch({ type: GAME_ACTION_TYPES.START })

    // if not, shuffle the deck
    await fetch(`http://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`)

    // and draw two cards for the player
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=4`
    )
    const { cards } = await response.json()

    // add cards to player hand
    dispatch({
      type: GAME_ACTION_TYPES.DRAW_SUCCESS,
      payload: {
        playerCards: [cards[0], cards[1]],
        houseCards: [cards[2], cards[3]],
      },
    })
  }

  const resetGame = () => {
    dispatch({ type: GAME_ACTION_TYPES.RESET })
  }

  const drawCard = async (params?: { house: boolean }) => {
    // check if the game is in a loading state
    if (gameState.loading) return

    // return when the game was lost
    if (gameState.ended) return

    // fetch a new card
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    )
    const { cards } = await response.json()

    if (params?.house) {
      // add it to the current state
      console.log(cards)
      dispatch({
        type: GAME_ACTION_TYPES.DRAW_SUCCESS,
        payload: { houseCards: cards },
      })
    } else {
      // add it to the current state
      dispatch({
        type: GAME_ACTION_TYPES.DRAW_SUCCESS,
        payload: { playerCards: cards },
      })
    }
  }

  const resolveHouse = async () => {
    dispatch({ type: GAME_ACTION_TYPES.END })
  }

  useEffect(() => {
    if (!gameState.ended) return
    if (gameState.houseScore >= 17) return // TODO WIN
    console.log("🐙", gameState.houseScore)

    drawCard({ house: true })
  }, [gameState.ended, gameState.houseScore])

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
    ({ item, index }) =>
      index === 0 || gameState.ended ? (
        <Image
          resizeMode="contain"
          source={{
            uri: item.image,
          }}
          style={styles.cardImage}
        />
      ) : (
        <Image
          resizeMode="contain"
          source={{
            uri: "https://playingcardstop1000.com/wp-content/uploads/2018/09/PlayingCardsTop1000-Rokoko-romi-Hungary-Card-back.jpg",
          }}
          style={styles.cardImage}
        />
      ),
    [gameState.ended]
  )

  if (gameState.loading) return <ActivityIndicator />

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
          data={gameState.houseCards}
          renderItem={renderHouseCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.handListContentContainer}
        />
      </View>
      <Text>Score: {gameState.ended ? gameState.houseScore : "?"}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Text>PLAYER</Text>
      <View style={styles.cardsContainer}>
        <FlatList
          horizontal
          data={gameState.playerCards}
          renderItem={renderPlayerCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.handListContentContainer}
        />
      </View>
      <Text>Score: {gameState.playerScore}</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      {gameState.started && !gameState.ended && (
        <Pressable onPress={() => drawCard()}>
          <Text style={styles.title}>Gimme a card!</Text>
        </Pressable>
      )}

      {gameState.started && !gameState.ended && (
        <Pressable onPress={resolveHouse}>
          <Text style={styles.title}>Show em!</Text>
        </Pressable>
      )}

      {gameState.started && bust && <Text style={styles.title}>BUST!</Text>}

      {gameState.ended && (
        <Pressable onPress={resetGame}>
          <Text style={styles.title}>Reset game</Text>
        </Pressable>
      )}

      {!gameState.started && (
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
