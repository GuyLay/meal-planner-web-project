import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import RecipeCard from "../components/recipes/RecipeCard";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRecipes, setUserRecipes] = useState([]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await fetch(
        `/api/recipes/delete?recipeId=${recipeId}&creator=${user.email}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        setUserRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));
      } else {
        console.error("Failed to delete recipe:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userInfo));
    setLoading(false);

    // Fetch user's recipes
    const fetchUserRecipes = async () => {
      try {
        const response = await fetch(`/api/recipes/user-recipes?email=${JSON.parse(userInfo).email}`);
        if (response.ok) {
          const data = await response.json();
          setUserRecipes(data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchUserRecipes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to view your profile</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Profile Section */}
      <div className="flex items-start space-x-8 mb-12">
        <div className="flex-shrink-0">
          <img
            src={user.profileImage || "/images/defaultprofile.jpg"}
            alt="User Profile"
            className="w-48 h-48 rounded-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/defaultprofile.jpg";
            }}
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-3xl font-bold mb-4">
            {user.firstName} {user.lastName}
          </h2>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <div>
              <span className="font-semibold">Food Preferences:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {user.foodPreferences?.map((preference) => (
                  <span
                    key={preference}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Recipes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Recipes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onRemove={(recipeId) => handleDeleteRecipe(recipeId)}
            />
          ))}
        </div>
        {userRecipes.length === 0 && (
          <p className="text-center text-gray-500">No recipes created yet</p>
        )}
      </div>
    </div>
  );
}