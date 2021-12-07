import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import { calculateScore } from "../helpers/gameHelper"
import { gameSaga } from "../sagas/gameSaga"
import {
  Card,
  Deck,
  TDrawSuccessPayload,
  TGameActionType,
  TGameState,
  TOpenGamePayload,
} from "../types"
import { GAME_ACTION_TYPES } from "./gameActions"

const DEFAULT_GAME_STATE = {
  started: false,
  ended: false,
  loading: false,
  houseCards: [],
  playerCards: [],
  playerScore: 0,
  houseScore: 0,
  result: "",
  deck: undefined,
}

export function gameReducer(
  state: TGameState = DEFAULT_GAME_STATE,
  action:
    | { type: Omit<TGameActionType, typeof GAME_ACTION_TYPES.DRAW_SUCCESS> }
    | {
        type: typeof GAME_ACTION_TYPES.DRAW_SUCCESS
        payload: { houseCards?: Card[]; playerCards?: Card[] }
      }
    | {
        type: typeof GAME_ACTION_TYPES.OPEN_GAME
        payload: { deck: Deck }
      }
): TGameState {
  switch (action.type) {
    case GAME_ACTION_TYPES.START:
      return {
        ...state,
        started: true,
        ended: false,
        loading: true,
        result: "",
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

      return {
        ...state,
        loading: false,
        houseCards: newHouseCards,
        playerCards: newPlayerCards,
        houseScore: calculateScore(newHouseCards),
        playerScore: calculateScore(newPlayerCards),
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
        result: "",
      }
    case GAME_ACTION_TYPES.CONCLUDE: {
      const houseBust = state.houseScore > 21
      const playerBust = state.playerScore > 21
      const playerHigher = state.playerScore > state.houseScore

      return {
        ...state,
        result:
          playerBust || (!houseBust && !playerHigher) ? "YOU LOSE" : "YOU WIN",
      }
    }
    case GAME_ACTION_TYPES.OPEN_GAME:
      const { payload } = action as { payload: TOpenGamePayload }
      return {
        // Keep the game state if the current game is opened again, otherwise reset it
        ...(payload.deck === state.deck ? state : DEFAULT_GAME_STATE),
        deck: payload.deck,
      }
    case GAME_ACTION_TYPES.CLOSE_GAME:
      return {
        ...state,
        deck: undefined,
      }
    default:
      console.log(
        "Something wrong: game reducer called with unknown action type: ",
        action.type
      )
      return state
  }
}

// Create redux store and inject saga middleware
const sagaMiddleware = createSagaMiddleware()
export const gameStore = createStore(
  gameReducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(gameSaga)

export const selectGameState = (state: TGameState) => state

export const selectStarted = (state: TGameState) => state.started

export const selectDeck = (state: TGameState) => state.deck
