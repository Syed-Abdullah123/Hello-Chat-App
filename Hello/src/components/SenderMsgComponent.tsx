import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SenderMessageComponent({ item }) {
  return (
    <View style={styles.container}>
      <Text>{item.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    width: 230,
    height: "auto",
    padding: 15,
    backgroundColor: "#e3f6a8",
    borderRadius: 30,
    borderWidth: 2,
    borderBottomEndRadius: 0,
    marginTop: 10,
  },
});
