import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export function ChattingScreenHeaderComponent({ route, navigation }: any) {
  const user = route.params?.user || {};
  return (
    <View style={styles.container}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={{ alignSelf: "center" }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
        <Image source={user.image} style={styles.image} />
        <View>
          <Text style={styles.headerText}>{user.name}</Text>
          <Text style={styles.headerText1}>Online</Text>
        </View>
      </View>
      <View style={styles.headerIcons}>
        <AntDesign name="phone" size={24} />
        <AntDesign name="videocamera" size={24} />
        <MaterialCommunityIcons
          name="dots-horizontal-circle-outline"
          size={24}
        />
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
    gap: 10,
    padding: 10,
    alignSelf: "center",
  },
  headerText: {
    fontWeight: "600",
    fontSize: 16,
    padding: 10,
    alignSelf: "center",
  },
  headerText1: {
    color: "green",
    fontSize: 12,
    paddingLeft: 10,
    bottom: 5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    alignSelf: "center",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignSelf: "center",
    left: 10,
  },
});
