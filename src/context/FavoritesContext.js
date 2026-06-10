import React, { createContext, useContext, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  function isFavorite(mealId) {
    return favorites.some((meal) => meal.idMeal === mealId);
  }

  function toggleFavorite(meal) {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.idMeal === meal.idMeal);

      if (exists) {
        return currentFavorites.filter((item) => item.idMeal !== meal.idMeal);
      }

      return [
        ...currentFavorites,
        {
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
        },
      ];
    });
  }

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
    }),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider.");
  }

  return context;
}