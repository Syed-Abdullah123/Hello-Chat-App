import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ReceiverMessageComponent({ item, route }) {
  const { user } = route.params;

  return (
    <>
      <View style={styles.recvContainer}>
        <Image source={{ uri: user.image }} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.container}>
            <Text>{item.message}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  recvContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  container: {
    left: 10,
    alignSelf: "flex-start",
    maxWidth: 230,
    height: "auto",
    padding: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderTopStartRadius: 0,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginTop: 10,
  },
  userName: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
});
