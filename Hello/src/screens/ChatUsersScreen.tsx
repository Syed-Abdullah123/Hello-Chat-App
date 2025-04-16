import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  Animated,
} from "react-native";
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
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUsers(dummyUsers);
      setLoading(false);

      // Start fade-in animation when loading is done
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handlePress = (user: User) => {
    navigation.navigate("ChatScreen", { user });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#333" style={styles.loader} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
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
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F5E4",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
