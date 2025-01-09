import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from 'next/link';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      const fetchRecipes = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            category === "all"
              ? `/api/recipes/all`
              : `/api/recipes/${category}`
          );
          if (!response.ok) {
            throw new Error(`Error fetching recipes: ${response.statusText}`);
          }
          const data = await response.json();
          setRecipes(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    }
  }, [category]);

  if (loading) return (
    <div className="container flex justify-center items-center mx-auto py-8" style={{ height: '60vh' }}>
      <img src="/loading.gif" alt="loading" style={{ height: '70%', width: '70%' }} />
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {category === "all" ? "All Recipes" : `${category} Recipes`}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
              <p className="placeholder-text">Image Placeholder</p>
            )}
          </div>
          <h2 className="recipe-box-title">{recipe.recipeName}</h2>
          <p className="recipe-box-time">
            {recipe.makingTime.hours}h {recipe.makingTime.minutes}m
          </p>
        </Link>        
        ))}
      </div>
    </div>
  );
}