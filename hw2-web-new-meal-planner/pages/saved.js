import { useEffect, useState } from "react";
import RecipeCard from "../components/recipes/RecipeCard";

export default function Saved() {
  const [savedRecipes, setSavedRecipes] = useState([]); // Store saved recipes
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user info from localStorage
      if (!user || !user.email) {
        setLoading(false); // Stop loading if no user is logged in
        return;
      }

      try {
        // Fetch saved recipes from API
        const response = await fetch(`/api/saved?userId=${user.email}`);
        if (response.ok) {
          const data = await response.json();
          setSavedRecipes(data); // Update state with fetched recipes
        } else {
          console.error("Failed to fetch saved recipes:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleDelete = async (recipeId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`/api/saved?userId=${user.email}&recipeId=${recipeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
      } else {
        console.error("Failed to delete recipe:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading text while fetching data
  }

  if (savedRecipes.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4">
        <h2 className="text-4xl font-extrabold leading-tight mb-8 text-gray-800 text-center">Saved Recipes</h2>
        <p className="text-lg text-gray-600 text-center">
          No saved items yet. Browse through the recipes and save the ones you love!
        </p>
        <img
          src="/images/saved.jpg"
          alt="No saved recipes"
          className="mx-auto mt-8 mb-8 rounded-lg shadow-lg max-w-sm w-full h-auto"
        />
        <div className="mt-6 flex justify-center">
          <a href="/recipes/all-recipes" className="btn whitespace-nowrap min-w-[150px]">
            Browse Recipes
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-4xl font-extrabold leading-tight mb-8 text-gray-800 text-center">Saved Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onRemove={(recipeId) => handleDelete(recipeId)}
          />
        ))}
      </div>
    </main>
  );
}