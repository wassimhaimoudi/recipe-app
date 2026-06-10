import React from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import EmptyState from "../components/EmptyState";
import MealCard from "../components/MealCard";
import { useFavorites } from "../context/FavoritesContext";
import colors from "../styles/colors";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();

  function openMeal(meal) {
    navigation.navigate("MealDetail", {
      mealName: meal.strMeal,
      mealThumb: meal.strMealThumb,
    });
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EmptyState
          title="No favorites yet"
          message="Open a recipe and press the star button to save it here."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MealCard meal={item} onPress={() => openMeal(item)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
  },
});