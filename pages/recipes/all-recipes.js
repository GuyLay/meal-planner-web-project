import { useState, useEffect } from "react";
import Link from "next/link";

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/recipes/filtered?category=${selectedCategory}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching recipes: ${response.statusText}`);
        }
        const data = await response.json();
        setRecipes(data.recipes);
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  if (loading) return (
    <div className="container flex justify-center items-center mx-auto py-8" style={{ height: '60vh' }}>
      <img src="/loading.gif" alt="loading" style={{ height: '70%', width: '70%' }} />
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Recipes</h1>
      
      <div className="flex">
        {/* Sidebar Filter */}
        <div className="w-64 pr-8 recipe-box">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded ${
                  selectedCategory === "all"
                    ? "bg-gray-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === category
                      ? "bg-gray-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link
                href={`/recipes/detail/${recipe._id}`}
                key={recipe._id}
                className="recipe-box"
              >
                <div className="recipe-box-image">
                  {recipe.recipeImage ? (
                    <img
                      src={recipe.recipeImage}
                      alt={recipe.recipeName}
                      className="recipe-image"
                    />
                  ) : (
                    <p className="placeholder-text">No Image</p>
                  )}
                </div>
                <h3 className="recipe-box-title">{recipe.recipeName}</h3>
                <p className="recipe-box-time">
                  {recipe.makingTime.hours > 0
                    ? `${recipe.makingTime.hours} hr${
                        recipe.makingTime.minutes > 0
                          ? ` ${recipe.makingTime.minutes} min`
                          : ""
                      }`
                    : `${recipe.makingTime.minutes} min`}
                </p>
              </Link>
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
