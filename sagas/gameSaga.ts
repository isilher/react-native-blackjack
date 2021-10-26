import { call, put, takeEvery } from "redux-saga/effects"
import { apiDrawCards, apiShuffleDeck } from "../api/deckApi"
import { GAME_ACTION_TYPES } from "../reducers/gameActions"
import { Deck } from "../types"

function* resetDeck(action: {
  type: typeof GAME_ACTION_TYPES.START
  payload: { deck_id: Deck["deck_id"] }
}) {
  console.log("🤔", action)
  try {
    // First, reshuffle the deck for a fresh game
    yield call(apiShuffleDeck, action.payload.deck_id)

    // Then, draw two cards for the player
    const cards = yield call(apiDrawCards, action.payload.deck_id, 4)

    yield put({
      type: GAME_ACTION_TYPES.DRAW_SUCCESS,
      payload: {
        playerCards: [cards[0], cards[1]],
        houseCards: [cards[2], cards[3]],
      },
    })
  } catch (e) {
    // yield put({ type: "USER_FETCH_FAILED", message: e.message })
    console.log("🐙", e.message)
  }
}

export function* gameSaga() {
  yield takeEvery(GAME_ACTION_TYPES.START, resetDeck)
}
