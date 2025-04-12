import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ChattingScreenHeaderComponent } from "../components/ChatScreenHeader";
import SenderMessageComponent from "../components/SenderMsgComponent";
import ReceiverMessageComponent from "../components/RecieverMsgComponent";
import ChatInputComponent from "../components/ChatInputComponent";

const ChatScreen = ({ navigation, route }: any) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <ChattingScreenHeaderComponent navigation={navigation} route={route} />
      <SenderMessageComponent />
      <ReceiverMessageComponent />
      <SenderMessageComponent />
      <ReceiverMessageComponent />
      <SenderMessageComponent />
      <ReceiverMessageComponent />
      <SenderMessageComponent />

      <ChatInputComponent />
      {/* <FlatList
        data={[]}
        renderItem={() => (
          <View>
          </View>
        )}
      /> */}
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F5E4",
    paddingTop: 25,
    paddingHorizontal: 10,
  },
});
