import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function ChatInputComponent({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
      style={styles.wrapper}
    >
      <View style={styles.inputContainer}>
        <AntDesign name="plus" size={20} style={styles.icon} />

        <TextInput
          value={text}
          placeholder="Type a message..."
          style={styles.input}
          onChangeText={setText}
          multiline
        />

        {/* <AntDesign name="camerao" size={24} style={styles.icon} />
        <AntDesign name="addfile" size={24} style={styles.icon} /> */}

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <FontAwesome name="send" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: Platform.OS === "ios" ? 10 : 15,
    paddingHorizontal: 10,
    backgroundColor: "#E5F5E4",
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fefef9",
  },
  icon: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 4,
  },
  input: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 6,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
