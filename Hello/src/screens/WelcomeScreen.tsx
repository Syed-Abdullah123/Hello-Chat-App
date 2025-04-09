// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// const WelcomeScreen = () => {
//   const navigation = useNavigation<any>();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to ChatApp</Text>
//       <Text style={styles.subtitle}>Connect with friends in real-time</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate("Signup")}
//       >
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.button, styles.signInButton]}
//         onPress={() => navigation.navigate("Signin")}
//       >
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   subtitle: {
//     fontSize: 18,
//     color: "#666",
//     marginBottom: 40,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 8,
//     marginVertical: 10,
//     width: "80%",
//     alignItems: "center",
//   },
//   signInButton: {
//     backgroundColor: "#34C759",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//   },
// });

// export default WelcomeScreen;

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/6346.jpg")}
        style={styles.logo}
      ></Image>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Say </Text>
        <Text style={[styles.title, styles.strokeText]}>Hello </Text>
        <Text style={styles.title}>to Chatting</Text>
      </View>
      <Text style={styles.description}>
        Connect with friends and family instantly with Hello. Start Chatting
        now!
      </Text>

      {/* Button container */}
      <View style={styles.outerContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: "Signup" }] })
            )
          }
          style={styles.buttonContainer}
        >
          <Text style={styles.text}>Get Started</Text>
          <Image
            source={require("../../assets/images/arrow-right.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    gap: 10,
  },
  logo: {
    width: "100%",
    height: "47%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#84AEBD",
  },
  description: {
    fontSize: 20,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 20,
  },
  strokeText: {
    color: "#82d7b3",
    textShadowColor: "#a7a7a7",
    fontSize: 80,
  },
  outerContainer: {
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#d6d6d6",
    margin: 10,
  },
  buttonContainer: {
    borderWidth: 2,
    borderRadius: 15,
    // padding: 10,
    flexDirection: "row",
    width: "98%",
    alignSelf: "center",
    bottom: 5,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  text: {
    color: "#82d7b3",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22,
  },
});
