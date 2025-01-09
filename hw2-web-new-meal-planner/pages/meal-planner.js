import React, { useState, useEffect } from "react";
import RecipesModal from "../components/meal-planner/RecipesModal";
import RecipeCard from "../components/recipes/RecipeCard";

const MealPlanner = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  const [mealPlan, setMealPlan] = useState(
    days.reduce((acc, day) => {
      acc[day] = { Breakfast: [], Lunch: [], Dinner: [] };
      return acc;
    }, {})
  );

  const [recipes, setRecipes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo) {
      alert("You need to log in to access the meal planner.");
      return;
    }

    setUser(JSON.parse(userInfo));
  
    const savedMealPlan = localStorage.getItem("mealPlan");
    if (savedMealPlan) {
      setMealPlan(JSON.parse(savedMealPlan)); // Load from local storage
    } else {
      // Fetch from database if not found in local storage
      const fetchMealPlan = async () => {
        try {
          const response = await fetch(`/api/meal-planner/meal-planner?userId=${JSON.parse(userInfo)._id}`);
          const data = await response.json();
          if (response.ok && data.mealPlan) {
            setMealPlan(data.mealPlan); // Load from database
            localStorage.setItem("mealPlan", JSON.stringify(data.mealPlan)); // Cache in local storage
          }
        } catch (error) {
          console.error("Error fetching meal plan:", error);
        }
      };
  
      fetchMealPlan();
    }

    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/meal-planner/all-recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);
  
  const openModal = (day, meal) => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDay(null);
    setSelectedMeal(null);
  };

  const addRecipesToMeal = (selectedRecipes) => {
    if (selectedDay && selectedMeal) {
      const updatedMealPlan = {
        ...mealPlan,
        [selectedDay]: {
          ...mealPlan[selectedDay],
          [selectedMeal]: [...mealPlan[selectedDay][selectedMeal], ...selectedRecipes],
        },
      };
  
      setMealPlan(updatedMealPlan);
      localStorage.setItem("mealPlan", JSON.stringify(updatedMealPlan)); // Save to local storage
    }
    closeModal();
  };

  const saveMealPlan = async () => {
    if (!user) {
      alert("You need to log in to save your meal plan.");
      return;
    }
  
    const mealPlanData = {
      userId: user._id,
      mealPlan,
    };
  
    try {
      const response = await fetch("/api/meal-planner/meal-planner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mealPlanData),
      });
  
      if (response.ok) {
        alert("Meal plan saved successfully!");
        localStorage.setItem("mealPlan", JSON.stringify(mealPlan)); // Sync local storage
      } else {
        alert("Failed to save meal plan.");
      }
    } catch (error) {
      alert("An error occurred while saving your meal plan.");
      console.error(error);
    }
  };  

  const deleteMealPlan = async () => {
    if (!user) {
      alert("You need to log in to delete your meal plan.");
      return;
    }
  
    if (!confirm("Are you sure you want to delete your meal plan?")) {
      return;
    }
  
    try {
      const response = await fetch("/api/meal-planner/meal-planner", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Meal plan deleted successfully!");
        const resetMealPlan = days.reduce((acc, day) => {
          acc[day] = { Breakfast: [], Lunch: [], Dinner: [] };
          return acc;
        }, {});
        setMealPlan(resetMealPlan);
        localStorage.removeItem("mealPlan"); // Clear local storage
      } else {
        const errorData = await response.json();
        console.error("Error deleting meal plan:", errorData);
        alert(errorData.error || "Failed to delete meal plan.");
      }
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      alert("An error occurred while deleting your meal plan.");
    }
  };
  
  const handleRemoveRecipe = (day, meal, recipeId) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: prev[day][meal].filter((recipe) => recipe._id !== recipeId),
      },
    }));
  };  

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Weekly Meal Planner</h1>
      <div className="overflow-x-auto">
        <div className="shadow-lg rounded-lg overflow-hidden bg-white">
          <table className="table-auto border-collapse border border-gray-300 mx-auto w-full max-w-8xl">
            <thead>
              <tr>
                <th className="top-0 bg-gray-50 border px-4 py-2">Day</th>
                {meals.map((meal) => (
                  <th key={meal} className="top-0 bg-gray-50 border px-4 py-2">
                    {meal}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr
                  key={day}
                >
                  <td className="border px-4 py-2 font-bold">{day}</td>
                  {meals.map((meal) => (
                    <td key={meal} className="border px-4 py-2">
                      <div className="space-y-2">
                        {mealPlan[day][meal].map((recipe, idx) => (
                          <RecipeCard
                            key={idx}
                            recipe={recipe}
                            onRemove={() => handleRemoveRecipe(day, meal, recipe._id)}
                          />
                        ))}
                        <button
                          className="add-btn text-blue-500 hover:underline"
                          onClick={() => openModal(day, meal)}
                        >
                          + Add Recipe
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="btn whitespace-nowrap min-w-[150px]"
          onClick={saveMealPlan}
        >
          Save Plan
        </button>
        <button
          className="btn whitespace-nowrap min-w-[150px]"
          onClick={deleteMealPlan}
        >
          Delete Plan
        </button>
      </div>
      {isModalOpen && (
        <RecipesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Add Recipes for ${selectedDay} - ${selectedMeal}`}
          recipes={recipes}
          onAddRecipes={addRecipesToMeal}
        />
      )}
    </div>
  );
};

export default MealPlanner;