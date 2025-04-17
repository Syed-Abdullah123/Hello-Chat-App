import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import { FontAwesome5 } from "@expo/vector-icons";

import { signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../firebase/config";

import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      navigation.navigate("Users");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/invalid-email") {
        message = "The email address is badly formatted.";
      } else if (error.code === "auth/user-not-found") {
        message = "No user found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      }
      Alert.alert("Login Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.inputContainer}>
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

        <View style={styles.rememberContainer}>
          <View style={styles.rememberMe}>
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? "#007AFF" : undefined}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            />
            <Text style={styles.rememberText}>Remember Me</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Reset Password",
                "Password reset instructions will be sent to your email address."
              )
            }
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button
        title="Sign In"
        onPress={handleSignIn}
        loading={loading}
        loadingText="Signing in..."
        style={{ marginTop: 20 }}
      />

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or Sign in with</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome5 name="google" size={20} color="#EA4335" />
          <Text style={styles.socialText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome5 name="facebook" size={24} color="#3b5998" />
          <Text style={styles.socialText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#E5F5E4",
  },
  inputContainer: {
    paddingTop: 20,
  },
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
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  forgotText: {
    fontSize: 14,
    color: "#007AFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: "#333",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff80",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "45%",
    justifyContent: "center",
  },
  socialText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});

export default SignInScreen;
