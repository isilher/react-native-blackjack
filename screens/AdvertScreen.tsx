import { StackScreenProps } from "@react-navigation/stack"
import React from "react"
import { View, Text, Pressable } from "react-native"
import { RootStackParamList } from "../types"

export const AdvertScreen: React.FC<
  StackScreenProps<RootStackParamList, "Advert">
> = ({ navigation, route }) => {
  return (
    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
      <Text>New for you: {route.name}</Text>
      <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
        <Text>Close me!</Text>
      </Pressable>
    </View>
  )
}
