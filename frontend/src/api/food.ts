import { apiClient } from "./client";
import { Category, FoodItem } from "../types";

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ categories: Category[] }>("/categories");
  return data.categories;
}

export async function fetchFoods(params?: {
  category?: string;
  search?: string;
  sort?: string;
}): Promise<FoodItem[]> {
  const { data } = await apiClient.get<{ foods: FoodItem[] }>("/foods", { params });
  return data.foods;
}

export async function fetchFeaturedFoods(): Promise<FoodItem[]> {
  const { data } = await apiClient.get<{ foods: FoodItem[] }>("/foods/featured");
  return data.foods;
}
