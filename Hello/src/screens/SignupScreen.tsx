import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { FIREBASE_AUTH } from '../firebase/config';
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  //   const handleSignUp = async () => {
  //     if (password !== confirmPassword) {
  //       Alert.alert('Error', 'Passwords do not match');
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
  //       navigation.navigate('SignIn');
  //     } catch (error: any) {
  //       Alert.alert('Error', error.message);
  //     }
  //     setLoading(false);
  //   };

  return (
    <View style={styles.container}>
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
        onPress={() => navigation.navigate("Signin")}
        loading={loading}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  inputContainer: {
    paddingTop: 10,
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
    backgroundColor: "#fff",
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
