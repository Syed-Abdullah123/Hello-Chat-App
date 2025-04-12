import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text, Pressable } from "react-native";
import ChatUserComponent from "../components/ChatUserComponent";
import dummyUsers from "../dummydata/users";

interface User {
  id: string;
  name: string;
  email: string;
  image: any;
  title: string;
  message: string;
  timestamp: string;
}

export default function ChatUsers({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(dummyUsers);
  }, []);

  const handlePress = (user: User) => {
    navigation.navigate("ChatScreen", { user });
  };

  return (
    <View style={styles.container}>
      {dummyUsers.length > 0 ? (
        <FlatList
          data={dummyUsers}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePress(item)}>
              <View>
                <ChatUserComponent user={item} />
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.loadingText}>Loading ...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F5E4",
  },
  loadingText: {
    fontSize: 18,
    color: "grey",
    alignSelf: "center",
  },
});
