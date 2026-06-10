import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EmptyState from "../components/EmptyState";
import ErrorView from "../components/ErrorView";
import IngredientRow from "../components/IngredientRow";
import LoadingView from "../components/LoadingView";
import {
  extractIngredients,
  extractInstructionSteps,
  getMealDetailsByName,
} from "../api/mealApi";
import { useFavorites } from "../context/FavoritesContext";
import colors from "../styles/colors";

export default function MealDetailScreen({ route, navigation }) {
  const { mealName, mealThumb } = route.params;

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { isFavorite, toggleFavorite } = useFavorites();

  async function loadMealDetails() {
    setLoading(true);
    setError("");

    try {
      const result = await getMealDetailsByName(mealName);
      setMeal(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMealDetails();
  }, [mealName]);

  const ingredients = useMemo(() => extractIngredients(meal), [meal]);

  const instructionSteps = useMemo(
    () => extractInstructionSteps(meal?.strInstructions),
    [meal]
  );

  if (loading) {
    return <LoadingView message="Loading recipe details..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadMealDetails} />;
  }

  if (!meal) {
    return (
      <EmptyState
        title="Recipe unavailable"
        message="No full recipe information was found for this meal."
      />
    );
  }

  const favorite = isFavorite(meal.idMeal);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Go back</Text>
        </Pressable>

        <Image
          source={{ uri: meal.strMealThumb || mealThumb }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{meal.strMeal}</Text>
            <Text style={styles.subtitle}>
              {meal.strCategory || "Recipe"}{" "}
              {meal.strArea ? `• ${meal.strArea}` : ""}
            </Text>
          </View>

          <Pressable
            onPress={() => toggleFavorite(meal)}
            style={[
              styles.favoriteButton,
              favorite && styles.favoriteButtonActive,
            ]}
          >
            <Text
              style={[
                styles.favoriteText,
                favorite && styles.favoriteTextActive,
              ]}
            >
              ★
            </Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{meal.strCategory || "Unknown"}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Origin</Text>
            <Text style={styles.infoValue}>{meal.strArea || "Unknown"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingredients</Text>

        <View style={styles.ingredientsContainer}>
          {ingredients.map((ingredient) => (
            <IngredientRow key={ingredient.id} ingredient={ingredient} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>

        <View style={styles.instructionsContainer}>
          {instructionSteps.length > 0 ? (
            instructionSteps.map((step, index) => (
              <View key={`${index}-${step}`} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>

                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.rawInstructions}>{meal.strInstructions}</Text>
          )}
        </View>
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
    paddingBottom: 34,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 18,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  heroImage: {
    width: "100%",
    height: 260,
    borderRadius: 18,
    backgroundColor: colors.black,
  },
  titleRow: {
    marginTop: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: colors.muted,
    fontWeight: "700",
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButtonActive: {
    backgroundColor: colors.primary,
  },
  favoriteText: {
    fontSize: 22,
    color: colors.primary,
  },
  favoriteTextActive: {
    color: colors.white,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "700",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 12,
  },
  ingredientsContainer: {
    marginBottom: 26,
  },
  instructionsContainer: {
    gap: 18,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.white,
    fontWeight: "900",
  },
  stepText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  rawInstructions: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});