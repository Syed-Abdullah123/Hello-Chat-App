import React from "react";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignupScreen";
import SignInScreen from "../screens/SigninScreen";
import ChatUsersScreen from "../screens/ChatUsersScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen
          name="Users"
          component={ChatUsersScreen}
          options={{
            headerBackVisible: false,
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
