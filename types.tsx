/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { GAME_ACTION_TYPES } from "./reducers/gameReducer"

export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  TabOne: undefined
  TabTwo: undefined
}

export type TabOneParamList = {
  LobbyScreen: undefined
}

export type TabTwoParamList = {
  GameScreen: undefined
}

export type Deck = {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
}

export type Card = {
  code: string
  image: string
  suit: "SPADES" | "HEARTS" | "CLUBS" | "DIAMONDS"
  value: string
}

export type DeckState = {
  decks: Deck[]
  loading: boolean
  addDeck: (deck: Deck) => void
}

export type TGameState = {
  started: boolean
  ended: boolean
  houseCards: Card[]
  playerCards: Card[]
  loading: boolean
  playerScore: number
  houseScore: number
  result: string
  deck: Deck | undefined
}
export type TGameActionTypeKey = keyof typeof GAME_ACTION_TYPES
export type TGameActionType = typeof GAME_ACTION_TYPES[TGameActionTypeKey]
export type TDrawSuccessPayload = { houseCards?: Card[]; playerCards?: Card[] }
export type TOpenGamePayload = { deck: Deck }

export interface ICurrentGameProps {
  deck: Deck
}
