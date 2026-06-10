import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "../components/EmptyState";
import ErrorView from "../components/ErrorView";
import LoadingView from "../components/LoadingView";
import MealCard from "../components/MealCard";
import { getCategories, getMealsByCategory } from "../api/mealApi";
import colors from "../styles/colors";

export default function HomeScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Beef");
  const [meals, setMeals] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoadingCategories(true);
    setError("");

    try {
      const result = await getCategories();
      setCategories(result);

      if (result.length > 0 && !selectedCategory) {
        setSelectedCategory(result[0].strCategory);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCategories(false);
    }
  }

  async function loadMeals(categoryName) {
    setLoadingMeals(true);
    setError("");

    try {
      const result = await getMealsByCategory(categoryName);
      setMeals(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMeals(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadMeals(selectedCategory);
    }
  }, [selectedCategory]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadCategories(), loadMeals(selectedCategory)]);
    setRefreshing(false);
  }, [selectedCategory]);

  function handleSearch() {
    const query = searchText.trim();

    if (!query) return;

    navigation.navigate("Search", {
      initialQuery: query,
    });

    setSearchText("");
  }

  function openMeal(meal) {
    navigation.navigate("MealDetail", {
      mealName: meal.strMeal,
      mealThumb: meal.strMealThumb,
    });
  }

  if (loadingCategories && categories.length === 0) {
    return <LoadingView message="Loading recipe categories..." />;
  }

  if (error && categories.length === 0) {
    return <ErrorView message={error} onRetry={loadCategories} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.smallTitle}>Welcome back</Text>
            <Text style={styles.mainTitle}>Find your recipe</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate("Favorites")}
            style={styles.favoriteButton}
          >
            <Text style={styles.favoriteText}>★</Text>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search meal by name..."
            placeholderTextColor={colors.muted}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />

          <Pressable onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.idCategory}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              selected={item.strCategory === selectedCategory}
              onPress={() => setSelectedCategory(item.strCategory)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          scrollEnabled
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Plats de la catégorie: {selectedCategory}
          </Text>
        </View>

        {loadingMeals ? (
          <LoadingView message="Loading meals..." />
        ) : error ? (
          <ErrorView message={error} onRetry={() => loadMeals(selectedCategory)} />
        ) : meals.length === 0 ? (
          <EmptyState
            title="No meals found"
            message="Try another category or use the search feature."
          />
        ) : (
          <View style={styles.mealGrid}>
            {meals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} onPress={() => openMeal(meal)} />
            ))}
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 30,
  },
  topBar: {
    marginTop: 10,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallTitle: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "600",
  },
  mainTitle: {
    fontSize: 28,
    color: colors.text,
    fontWeight: "900",
    marginTop: 2,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    fontSize: 22,
    color: colors.primary,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 6,
    marginBottom: 22,
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
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
  },
  categoriesList: {
    paddingBottom: 24,
  },
  mealGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});