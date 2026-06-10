import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";

export default function LoadingView({ message = "Loading..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    color: colors.muted,
    fontWeight: "600",
  },
});