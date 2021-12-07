import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useCallback } from "react"
import { ActivityIndicator, Image, FlatList, ScrollView } from "react-native"
import { Pressable, StyleSheet } from "react-native"
import { ICurrentGameProps } from "../types"
import { View, Text } from "./Themed"
import { useDispatch, useSelector } from "react-redux"
import { selectDeck, selectGameState } from "../reducers/gameReducer"
import { GAME_ACTION_TYPES } from "../reducers/gameActions"

export const CurrentGame: React.FC<ICurrentGameProps> = () => {
  const gameState = useSelector(selectGameState)
  const dispatch = useDispatch()

  const deck = useSelector(selectDeck)

  const bust = gameState.playerScore > 21

  const closeGame = () => {
    dispatch({ type: GAME_ACTION_TYPES.CLOSE_GAME })
  }

  const startNewGame = async () => {
    // Prevent starting in an unready state
    if (gameState.started) return

    // Trigger a new game saga
    dispatch({
      type: GAME_ACTION_TYPES.START,
      payload: { deck_id: deck?.deck_id },
    })
  }

  const resetGame = () => {
    dispatch({ type: GAME_ACTION_TYPES.RESET })
  }

  const drawCard = async (params?: { house: boolean }) => {
    // check if the game is in a loading state
    if (gameState.loading) return

    // fetch a new card
    const response = await fetch(
      `http://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    )
    const { cards } = await response.json()

    if (params?.house) {
      // add it to the current state
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
    if (gameState.houseScore >= 17) {
      if (!gameState.result) dispatch({ type: GAME_ACTION_TYPES.CONCLUDE })
      return
    }

    drawCard({ house: true })
  }, [gameState.ended, gameState.houseScore])

  useEffect(() => {
    if (gameState.ended) return
    if (gameState.playerScore > 21) dispatch({ type: GAME_ACTION_TYPES.END })
  }, [gameState.ended, gameState.playerScore])

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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Deck {deck?.deck_id}</Text>

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

      {!!gameState.result && (
        <View>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text>{gameState.result}</Text>
        </View>
      )}

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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
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
