import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SignUpScreen from "../screens/SignupScreen";
import SignInScreen from "../screens/SigninScreen";

const Tab = createMaterialTopTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabWrapper}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const label =
          route.name === "Signup"
            ? "Sign Up"
            : route.name === "Signin"
            ? "Sign In"
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tabButton, isFocused && styles.activeTab]}
          >
            <Text style={[styles.tabText, isFocused && styles.activeTabText]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AuthNavigator = () => {
  const [activeTab, setActiveTab] = useState("Signup");

  const handleTabChange = (index: number) => {
    const routeName = index === 0 ? "Signup" : "Signin";
    setActiveTab(routeName);
  };

  const getTitle = () =>
    activeTab === "Signup" ? "Get Started Now" : "Welcome Back!";
  const getDescription = () =>
    activeTab === "Signup"
      ? "Create your account or log in to explore about your app."
      : "Sign in to pick up where you left off and continue your journey with us.";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.subtitle}>{getDescription()}</Text>

      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
        }}
        screenListeners={{
          state: (e) => handleTabChange(e.data.state.index),
        }}
      >
        <Tab.Screen name="Signup" component={SignUpScreen} />
        <Tab.Screen name="Signin" component={SignInScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F5E4",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  tabWrapper: {
    flexDirection: "row",
    backgroundColor: "#ffffff80",
    borderRadius: 25,
    padding: 6,
    marginTop: 20,
    justifyContent: "space-between",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "transparent",
    borderRadius: 25,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#D1F06F",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#000",
  },
});

export default AuthNavigator;
