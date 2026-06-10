import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import colors from "../styles/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
        },
        headerTintColor: colors.text,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Recipe App",
        }}
      />

      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Search Meals",
        }}
      />

      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Favorites",
        }}
      />

      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{
          title: "Recipe Details",
        }}
      />
    </Stack.Navigator>
  );
}