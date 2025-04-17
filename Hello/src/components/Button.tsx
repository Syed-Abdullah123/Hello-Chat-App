import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
}

const Button = ({
  title,
  onPress,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  style = {},
  textStyle = {},
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled,
        style,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color="#000"
            size="small"
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.buttonText, textStyle]}>{loadingText}</Text>
        </View>
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#D1F06f",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Button;
