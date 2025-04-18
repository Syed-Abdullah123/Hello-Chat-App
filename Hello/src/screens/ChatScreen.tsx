import React, { useState, useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import socket from "../utils/socket";

import SenderMessageComponent from "../components/SenderMsgComponent";
import ReceiverMessageComponent from "../components/RecieverMsgComponent";
import ChatInputComponent from "../components/ChatInputComponent";

import { ChattingScreenHeaderComponent } from "../components/ChatScreenHeader";

interface Message {
  sender: string;
  image: string;
  message: string;
}

const ChatScreen = ({ navigation, route }: any) => {
  const { user } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    console.log("Connecting to socket...");

    socket.on("connect", () => {
      console.log("✅ Connected to socket server!", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection error:", err.message);
    });

    return () => {
      socket.off("receive_message");
      socket.off("connect");
    };
  }, []);

  const sendMessage = (message) => {
    const msgData = {
      sender: user.name,
      image: user.image,
      message,
    };
    socket.emit("send_message", msgData);
  };

  return (
    <View style={styles.container}>
      <ChattingScreenHeaderComponent navigation={navigation} route={route} />

      <View>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) =>
            item.sender === user.name ? (
              <SenderMessageComponent item={item} />
            ) : (
              <ReceiverMessageComponent item={item} />
            )
          }
          inverted
        />
      </View>

      <ChatInputComponent onSend={sendMessage} />
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
