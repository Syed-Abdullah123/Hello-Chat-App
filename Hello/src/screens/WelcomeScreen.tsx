import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {/* Top illustration or hero image */}
      {/* <Image
        source={require("../../assets/images/chat-illustration.png")}
        style={styles.heroImage}
        resizeMode="contain"
      /> */}

      {/* Title & Tagline */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>Chatter</Text>
        <Text style={styles.tagline}>
          A modern way to stay connected with your world.
        </Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate("AuthTabs", { screen: "Signup" })}
      >
        <Text style={styles.getStartedText}>Get Started</Text>
        <Image
          source={require("../../assets/images/arrow-right.png")}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      {/* Social Logins (optional placeholder) */}
      <View style={styles.socialContainer}>
        <Text style={styles.orText}>Or continue with</Text>
        {/* <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/icons/google.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/icons/facebook.png")}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
  },
  heroImage: {
    width: width * 0.85,
    height: width * 0.85,
    marginTop: 30,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    color: "#333",
    fontWeight: "600",
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#5F9DF7",
    marginTop: -5,
  },
  tagline: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  getStartedButton: {
    backgroundColor: "#5F9DF7",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  socialContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  orText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  socialIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
});
