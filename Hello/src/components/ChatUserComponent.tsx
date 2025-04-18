import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ChatUserComponent({ user }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: user.image }}
          defaultSource={require("../../assets/images/default.png")}
        ></Image>
        <View style={styles.midContainer}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.message}>{user.message}</Text>
        </View>
        <Text style={styles.timestamp}>{user.timestamp.slice(0, 10)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderWidth: 2,
    borderRadius: 15,
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "rgba(229,245,228,0.7)",
    borderTopWidth: 0,
    margin: 10,
  },
  container: {
    borderWidth: 2,
    borderRadius: 15,
    padding: 10,
    flexDirection: "row",
    width: "98%",
    alignSelf: "center",
    bottom: 5,
    backgroundColor: "rgba(229,245,228,0.7)",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  midContainer: {
    flex: 1,
    marginLeft: 10,
    alignSelf: "center",
    gap: 5,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: "grey",
    marginTop: 5,
  },
});
