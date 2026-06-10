import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import colors from "../styles/colors";

export default function CategoryCard({ category, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selectedContainer,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: category.strCategoryThumb }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        numberOfLines={1}
        style={[styles.title, selected && styles.selectedTitle]}
      >
        {category.strCategory}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 112,
    height: 126,
    marginRight: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  selectedContainer: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 82,
    height: 70,
    marginBottom: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  selectedTitle: {
    color: colors.white,
  },
});