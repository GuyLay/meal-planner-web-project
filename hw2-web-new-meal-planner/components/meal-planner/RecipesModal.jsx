import React, { useState } from "react";

const RecipesModal = ({ isOpen, onClose, title, recipes, onAddRecipes }) => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Toggle the selection of a recipe
  const toggleRecipeSelection = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      const isSelected = prevSelected.some((r) => r._id === recipe._id);

      if (isSelected) {
        // Remove the recipe if it's already selected
        return prevSelected.filter((r) => r._id !== recipe._id);
      } else {
        // Add the recipe to the selected list
        return [...prevSelected, recipe];
      }
    });
  };

  // Handle adding selected recipes
  const handleAddSelectedRecipes = () => {
    if (selectedRecipes.length > 0) {
      onAddRecipes(selectedRecipes); // Pass selected recipes to parent
    }
    setSelectedRecipes([]); // Clear the selection
    onClose(); // Close the modal
  };

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 z-50">
        {/* Modal Header */}
        <div className="modal-header flex justify-between items-center p-4 border-b">
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            X
          </button>
          <h2 className="text-lg font-bold">{title}</h2>
          <input
            type="text"
            placeholder="Search recipes..."
            className="ml-4 p-2 border rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recipe List */}
        <div className="modal-body p-4 max-h-96 overflow-y-auto">
          {filteredRecipes.length > 0 ? (
            <ul className="grid grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <li
                  key={recipe._id}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    selectedRecipes.some((r) => r._id === recipe._id)
                      ? "border-blue-500 bg-blue-100"
                      : ""
                  }`}
                  onClick={() => toggleRecipeSelection(recipe)}
                >
                  <img
                    src={recipe.recipeImage}
                    alt={recipe.recipeName}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2 text-center">
                    <h3 className="font-bold text-sm">{recipe.recipeName}</h3>
                    <p className="text-sm text-gray-500">
                      {recipe.ingredients.length} ingredients •{" "}
                      {recipe.makingTime.hours > 0
                        ? `${recipe.makingTime.hours} hr ${recipe.makingTime.minutes} min`
                        : `${recipe.makingTime.minutes} min`}
                    </p>
                    {selectedRecipes.some((r) => r._id === recipe._id) && (
                      <p className="text-blue-500 text-sm mt-1">Selected</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No recipes found.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer p-4 border-t flex justify-center items-center">
          <button
            className={`add-btn ${
              selectedRecipes.length === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            style={{ width: "150px" }}
            onClick={handleAddSelectedRecipes}
            disabled={selectedRecipes.length === 0}
          >
            Add to Day
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipesModal;
