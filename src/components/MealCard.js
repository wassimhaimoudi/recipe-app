import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../styles/colors";

export default function MealCard({ meal, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />

      <View style={styles.footer}>
        <Text numberOfLines={2} style={styles.title}>
          {meal.strMeal}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 16,
    backgroundColor: colors.surface,
    overflow: "hidden",
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: 145,
    backgroundColor: colors.border,
  },
  footer: {
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
});