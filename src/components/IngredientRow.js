import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";

export default function IngredientRow({ ingredient }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.name}>{ingredient.name}</Text>
      </View>

      <Text style={styles.measure}>{ingredient.measure}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 46,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bullet: {
    fontSize: 24,
    color: colors.text,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  measure: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
    textAlign: "right",
    maxWidth: 150,
  },
});