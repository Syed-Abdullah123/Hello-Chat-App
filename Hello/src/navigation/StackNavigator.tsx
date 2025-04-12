import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
// import SignUpScreen from "../screens/SignupScreen";
// import SignInScreen from "../screens/SigninScreen";
import ChatUsersScreen from "../screens/ChatUsersScreen";
import ChatScreen from "../screens/ChatScreen";
import AuthNavigator from "./AuthNavigator";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthTabs"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Users"
          component={ChatUsersScreen}
          options={{
            headerBackVisible: false,
            headerTitle: "Chatting Room",
            headerTitleStyle: { fontSize: 18 },
            headerStyle: { backgroundColor: "#E5F5E4" },
            headerShadowVisible: false,
            headerRight: () => {
              return (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <MaterialIcons name="notifications" size={24} color="black" />
                  <MaterialIcons name="search" size={24} color="black" />
                </View>
              );
            },
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
