import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebase/config";

export function ChattingScreenHeaderComponent({
  route,
  navigation,
  isOnline,
}: any) {
  const { user } = route.params;
  const { getCurrentUserId } = require("../utils/socket");

  // You need to store your own user information somewhere
  // For example, from your auth context or local storage
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  // Fetch current user info when component mounts
  useEffect(() => {
    const fetchCurrentUserInfo = async () => {
      // Get your user data from Firebase or your auth system
      // This is just an example - replace with your actual user data retrieval
      const userDoc = await getDoc(
        doc(FIREBASE_DB, "users", getCurrentUserId())
      );
      if (userDoc.exists()) {
        setCurrentUserInfo(userDoc.data());
      }
    };

    fetchCurrentUserInfo();
  }, []);

  const initiateCallHandler = (callType) => {
    const { initiateCall } = require("../utils/socket");

    // Use YOUR user info, not the chat partner's
    const currentUser = {
      id: getCurrentUserId(),
      name: currentUserInfo?.name || "User", // Your name
      image: currentUserInfo?.image || "https://via.placeholder.com/150", // Your image
    };

    // Notify receiver about call
    initiateCall(user.id, callType, currentUser);

    navigation.navigate("Call", {
      user,
      callType: callType,
      isVideoCall: callType === "video",
      isIncoming: false,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
        <Image source={{ uri: user.image }} style={styles.image} />
        <View>
          <Text style={styles.headerText}>{user.name}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.status,
                { backgroundColor: isOnline ? "#00c851" : "#ff4444" },
              ]}
            />
            <Text style={styles.headerText1}>
              {isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.headerIcons}>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => initiateCallHandler("audio")}
        >
          <AntDesign name="phone" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={styles.hitSlop}
          onPress={() => initiateCallHandler("video")}
        >
          <AntDesign name="videocamera" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E5F5E4",
  },
  headerLeft: {
    flexDirection: "row",
    // gap: 10,
    padding: 10,
    alignSelf: "center",
  },
  backArrow: {
    alignSelf: "center",
  },
  statusContainer: {
    flexDirection: "row",
    gap: 5,
    paddingLeft: 10,
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    bottom: 2,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 16,
    padding: 10,
    alignSelf: "center",
  },
  headerText1: {
    color: "#666",
    fontSize: 12,
    bottom: 5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 20,
    padding: 10,
    alignSelf: "center",
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignSelf: "center",
    left: 10,
    marginRight: 10,
  },
});
