import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function ReceiverMessageComponent({ item }) {
  return (
    <>
      <View style={{ flexDirection: "row" }}>
        <Image source={{ uri: item.image }} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{item.name}</Text>
          <View style={styles.container}>
            <Text>Really why can't it be?</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 10,
    alignSelf: "flex-start",
    width: 230,
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
