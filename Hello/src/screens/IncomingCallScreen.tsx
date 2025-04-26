import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { acceptCall, rejectCall } from "../utils/socket";
import { StatusBar } from "expo-status-bar";

const IncomingCallScreen = ({ route, navigation }) => {
  const { caller, callType } = route.params;

  const handleAccept = () => {
    // First send accept call signal so caller knows we're accepting
    acceptCall(caller.id);

    // Then navigate to call screen
    navigation.replace("Call", {
      user: caller,
      callType: callType,
      isVideoCall: callType === "video",
      isIncoming: true,
    });
  };

  const handleReject = () => {
    rejectCall(caller.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.callerInfoContainer}>
        <Image source={{ uri: caller.image }} style={styles.callerImage} />
        <Text style={styles.callerName}>{caller.name}</Text>
        <Text style={styles.callTypeText}>
          {callType === "video" ? "Video Call" : "Audio Call"}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={handleReject}
        >
          <Ionicons name="call" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={handleAccept}
        >
          <Ionicons name="call" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" backgroundColor="transparent" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#121212",
    padding: 20,
  },
  callerInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  callerName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  callTypeText: {
    fontSize: 18,
    color: "#999",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    transform: [{ rotate: "90deg" }],
  },
  rejectButton: {
    backgroundColor: "#F44336",
    transform: [{ rotate: "225deg" }],
  },
});

export default IncomingCallScreen;
