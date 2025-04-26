import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
  const [isOnline, setIsOnline] = useState(false);
  const { getCurrentUserId } = require("../utils/socket");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [data, ...prev]);
    });

    // Check connection status
    setIsOnline(socket.connected);

    socket.on("connect", () => {
      console.log("✅ Connected to socket server!", socket.id);
      setIsOnline(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket server.");
      setIsOnline(false);
    });

    // Listen for incoming calls
    const incomingCallHandler = ({ callType, caller }) => {
      console.log("Incoming call received", caller, callType);
      // Navigate to incoming call screen
      navigation.navigate("IncomingCall", {
        caller,
        callType,
      });
    };

    socket.on("incoming_call", incomingCallHandler);

    return () => {
      // Just remove listeners but don't disconnect
      socket.off("receive_message");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("incoming_call", incomingCallHandler);
    };
  }, [navigation]);

  const sendMessage = (message) => {
    const msgData = {
      sender: user.name,
      image: user.image,
      message,
    };
    socket.emit("send_message", msgData);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ChattingScreenHeaderComponent
        navigation={navigation}
        route={route}
        isOnline={isOnline}
      />

      <View style={styles.chatArea}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) =>
            item.sender === user.name ? (
              <SenderMessageComponent item={item} />
            ) : (
              <ReceiverMessageComponent item={item} route={route} />
            )
          }
          inverted
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      <ChatInputComponent onSend={sendMessage} />
    </KeyboardAvoidingView>
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
  chatArea: {
    flex: 1,
  },
});
