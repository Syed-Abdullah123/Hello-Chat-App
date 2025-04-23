import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";

const IncomingCallScreen = ({ route, navigation }) => {
  const { fromUserId, callType, isVideoCall } = route.params;

  const handleAccept = () => {
    navigation.replace("Call", {
      user: { id: fromUserId }, // Add other user details if needed
      callType,
      isVideoCall,
    });
  };

  const handleReject = () => {
    navigation.goBack(); // or show a rejection message
  };

  return (
    <View style={styles.container}>
      <Text>Incoming {callType} call...</Text>
      <Button title="Accept" onPress={handleAccept} />
      <Button title="Reject" onPress={handleReject} />
    </View>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
