import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
  FIREBASE_DB,
} from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const pickImage = async () => {
    // Ask for media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your gallery to let you upload a profile picture.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Updated!
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Oops!", "Something went wrong while picking the image.");
      console.error("Image Picker Error:", err);
    }
  };

  const uploadImageAsync = async (uri, userId) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const imageRef = ref(FIREBASE_STORAGE, `profileImages/${userId}`);
    await uploadBytes(imageRef, blob);
    return await getDownloadURL(imageRef);
  };

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Error", "Please fill in all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      let photoURL = null;

      if (image) {
        photoURL = await uploadImageAsync(image, user.uid);
      }

      await updateProfile(user, {
        displayName: username,
        photoURL,
      });

      await setDoc(doc(FIREBASE_DB, "users", user.uid), {
        id: user.uid,
        name: username,
        email: user.email,
        image: photoURL,
        title: "New user",
        message: "Hey there! I’m using the app.",
        timestamp: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created!");
      navigation.navigate("Signin");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Make sure to upload your image</Text>
        <TouchableOpacity style={styles.avatarPlaceholder} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarPlaceholderText}>Pick Image</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
      </View>

      <Button
        title="Sign Up"
        onPress={handleSignUp}
        loading={loading}
        loadingText="Creating account..."
        style={{ marginTop: 20 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#E5F5E4",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 12,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  avatarPlaceholderText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  inputContainer: {},
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff80",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 15,
    color: "#333",
  },
});

export default SignUpScreen;
