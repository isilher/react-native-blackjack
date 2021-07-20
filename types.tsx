/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  TabOne: undefined
  TabTwo: undefined
}

export type TabOneParamList = {
  TabOneScreen: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
}

export type Deck = {
  success: boolean
  deck_id: string
  shuffled: boolean
  remaining: number
}

export type DeckState = {
  decks: Deck[]
  loading: boolean
  addDeck: (deck: Deck) => void
}
