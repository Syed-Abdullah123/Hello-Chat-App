import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function ChatInputComponent() {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AntDesign name="smileo" size={24} />
        <View>
          <TextInput placeholder="Type a message..." style={styles.input} />
        </View>
        <AntDesign name="camerao" size={24} />
        <AntDesign name="addfile" size={24} />
        <View style={styles.micView}>
          <FontAwesome name="microphone" size={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
  },
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    height: 70,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "black",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff80",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
  micView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginLeft: 9,
  },
});
