import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const ChatScreen = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      title: route.params.user.name,
    });
  });

  return (
    <View style={styles.container}>
      <Text>Welcome to ChatScreen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
