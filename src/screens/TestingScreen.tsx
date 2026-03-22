import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
function TestingScreen() {
  const { userData: user } = useAuth();
  return (
    <View>
      <Text>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad officiis sapiente saepe aliquid dolor quia laborum quas dolore nihil omnis voluptatibus neque quae, at nulla, eos sequi architecto itaque doloribus?</Text>
    </View>
  );
}

export default TestingScreen;