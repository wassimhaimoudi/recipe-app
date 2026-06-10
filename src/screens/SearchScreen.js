import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EmptyState from "../components/EmptyState";
import ErrorView from "../components/ErrorView";
import LoadingView from "../components/LoadingView";
import MealCard from "../components/MealCard";
import { searchMealsByName } from "../api/mealApi";
import colors from "../styles/colors";

export default function SearchScreen({ route, navigation }) {
  const initialQuery = route.params?.initialQuery || "";

  const [query, setQuery] = useState(initialQuery);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(customQuery = query) {
    const cleanQuery = customQuery.trim();

    if (!cleanQuery) return;

    Keyboard.dismiss();
    setLoading(true);
    setHasSearched(true);
    setError("");

    try {
      const result = await searchMealsByName(cleanQuery);
      setMeals(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, []);

  function openMeal(meal) {
    navigation.navigate("MealDetail", {
      mealName: meal.strMeal,
      mealThumb: meal.strMealThumb,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Example: Arrabiata, Chicken, Beef..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            style={styles.searchInput}
            returnKeyType="search"
          />

          <Pressable onPress={() => handleSearch()} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        {loading ? (
          <LoadingView message="Searching meals..." />
        ) : error ? (
          <ErrorView message={error} onRetry={() => handleSearch()} />
        ) : !hasSearched ? (
          <EmptyState
            title="Search recipes"
            message="Type a meal name to find recipes from TheMealDB."
          />
        ) : meals.length === 0 ? (
          <EmptyState
            title="No results"
            message="Try another meal name. For example: pasta, chicken, beef, or cake."
          />
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <MealCard meal={item} onPress={() => openMeal(item)} />
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 6,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 14,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: "800",
  },
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 30,
  },
});