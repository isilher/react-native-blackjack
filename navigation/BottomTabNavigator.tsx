/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import * as React from "react"
import { AddDeckButton } from "../components/AddDeckButton"

import Colors from "../constants/Colors"
import { DeckProvider } from "../contexts/DeckContext"
import useColorScheme from "../hooks/useColorScheme"
import LobbyScreen from "../screens/LobbyScreen"
import GameScreen from "../screens/GameScreen"
import { BottomTabParamList, LobbyParamList, GameParamList } from "../types"
import { useSelector } from "react-redux"
import { selectStarted } from "../reducers/gameReducer"

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme()
  const gameStarted = useSelector(selectStarted)

  return (
    <BottomTab.Navigator
      initialRouteName="Lobby"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Lobby"
        component={LobbyNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
          title: "Lobby",
        }}
      />
      <BottomTab.Screen
        name="Game"
        component={GameNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
          title: !gameStarted ? "New Game" : "Current Game",
        }}
      />
    </BottomTab.Navigator>
  )
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"]
  color: string
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const LobbyStack = createStackNavigator<LobbyParamList>()

function LobbyNavigator() {
  return (
    <DeckProvider>
      <LobbyStack.Navigator>
        <LobbyStack.Screen
          name="LobbyScreen"
          component={LobbyScreen}
          options={{
            headerTitle: "Lobby",
            headerRight: () => <AddDeckButton />,
          }}
        />
      </LobbyStack.Navigator>
    </DeckProvider>
  )
}

const GameStack = createStackNavigator<GameParamList>()

function GameNavigator() {
  return (
    <GameStack.Navigator screenOptions={{ headerShown: false }}>
      <GameStack.Screen
        name="GameScreen"
        component={GameScreen}
        options={{ headerTitle: "Game", headerShown: true }}
      />
    </GameStack.Navigator>
  )
}
