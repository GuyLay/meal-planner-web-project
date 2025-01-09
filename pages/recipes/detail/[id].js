import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function RecipeDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch recipe details
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/recipes/detail/${id}`);
          if (!response.ok) {
            throw new Error(`Error fetching recipe: ${response.statusText}`);
          }
          const data = await response.json();
          setRecipe(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id]);

  // Check if recipe is saved
  useEffect(() => {
    if (id) {
      const user = localStorage.getItem('user') ? 
        JSON.parse(localStorage.getItem('user')) : null;
        
      if (user) {
        const checkSaveStatus = async () => {
          try {
            const response = await fetch(`/api/recipes/save-status/${id}`, {
              headers: {
                'user-email': user.email
              }
            });
            if (response.ok) {
              const data = await response.json();
              setIsSaved(data.isSaved);
            }
          } catch (err) {
            console.error("Error checking save status:", err);
          }
        };
        checkSaveStatus();
      }
    }
  }, [id]);

  const handleSaveToggle = async () => {
    const user = localStorage.getItem('user') ? 
      JSON.parse(localStorage.getItem('user')) : null;
   
    if (!user) {
      router.push('/auth/signin');
      return;
    }
   
    try {
      setSaveLoading(true);
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: id,
          action: isSaved ? 'unsave' : 'save',
          email: user.email
        })
      });
   
      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
   };

   const handleOrder = async () => {
    const user = localStorage.getItem('user') ? 
      JSON.parse(localStorage.getItem('user')) : null;
     
    if (!user) {
      router.push('/auth/signin');
      return;
    }
     
    try {
      const response = await fetch('/api/shopping-list/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          recipeName: recipe.recipeName,
          items: recipe.ingredients,
          createdAt: new Date()
        })
      });
     
      if (response.ok) {
        alert('Added to shopping list!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add to shopping list');
    }
  };

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>Recipe not found</p>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
      <h1 className="justify-self-start text-4xl font-bold">
        {recipe.recipeName}
      </h1>
      <div className="flex gap-4">
          <button
            className={`btn ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSaveToggle}
            disabled={saveLoading}
          >
            {isSaved ? 'Unsave' : 'Save'}
          </button>
          <button
            className="btn"
            onClick={handleOrder}
          >
            Order
          </button>
        </div>
  </div>

        <div className="mb-8">
          {recipe.recipeImage && (
            <img
              src={recipe.recipeImage}
              alt={recipe.recipeName}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <p className="mb-2">Category: {recipe.recipeCategory}</p>
            <p className="mb-2">
              Time: {recipe.makingTime.hours}h {recipe.makingTime.minutes}m
            </p>
            <p className="mb-2">Created by: {recipe.creator}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Nutrition</h2>
            <p className="mb-2">Calories: {recipe.nutrition.calories}</p>
            <p className="mb-2">Protein: {recipe.nutrition.protein}g</p>
            <p className="mb-2">Carbs: {recipe.nutrition.carbs}g</p>
            <p className="mb-2">Fat: {recipe.nutrition.fat}g</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc pl-6">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="mb-2">
                {ingredient.amount} {ingredient.unit} {ingredient.ingredientName}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal pl-6">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="mb-2">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}