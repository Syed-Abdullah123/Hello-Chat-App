import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import Button from "../components/Button";

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const bounceAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/Guftaar.png")}
        style={[styles.image, { opacity: fadeAnim }]}
      />
      <Animated.Image
        source={require("../../assets/images/convo.png")}
        style={{ width: "100%", height: "60%", opacity: fadeAnim, bottom: 30 }}
      />
      <Animated.View style={[styles.midContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Welcome to Guftaar</Text>
        <Text style={styles.desc}>
          Your space to connect, chat, and share moments with loved ones.!
        </Text>
        <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
          <Button
            title="Let's start the conversation"
            onPress={() => navigation.navigate("AuthTabs")}
            style={{ width: "100%", marginTop: 20 }}
          />
        </Animated.View>
      </Animated.View>
      <StatusBar style="auto" backgroundColor="#E5F5E4" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F5E4",
  },
  image: {
    width: "50%",
    height: 150,
    top: 50,
    alignSelf: "center",
    resizeMode: "contain",
  },
  midContainer: {
    flex: 1,
    backgroundColor: "#E5F5E4",
    paddingHorizontal: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#333",
    fontWeight: "bold",
    marginTop: 20,
  },
  desc: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default WelcomeScreen;
