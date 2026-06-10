const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function request(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error("Network response was not successful.");
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "Something went wrong while fetching data.");
  }
}

export async function getCategories() {
  const data = await request("/categories.php");
  return data.categories || [];
}

export async function getMealsByCategory(categoryName) {
  const data = await request(`/filter.php?c=${encodeURIComponent(categoryName)}`);
  return data.meals || [];
}

export async function searchMealsByName(query) {
  const data = await request(`/search.php?s=${encodeURIComponent(query)}`);
  return data.meals || [];
}

export async function getMealDetailsByName(mealName) {
  const meals = await searchMealsByName(mealName);

  if (!meals || meals.length === 0) {
    return null;
  }

  const exactMatch = meals.find(
    (meal) => meal.strMeal.toLowerCase() === mealName.toLowerCase()
  );

  return exactMatch || meals[0];
}

export function extractIngredients(meal) {
  if (!meal) return [];

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredients.push({
        id: `${i}`,
        name: ingredient.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  return ingredients;
}

export function extractInstructionSteps(instructions) {
  if (!instructions) return [];

  return instructions
    .split(/\r?\n|(?<=\.)\s+/)
    .map((step) => step.trim())
    .filter((step) => step.length > 8);
}