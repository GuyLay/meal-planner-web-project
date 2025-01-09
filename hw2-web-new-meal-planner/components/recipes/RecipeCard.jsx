import Link from "next/link";

const RecipeCard = ({ recipe, onRemove }) => {
  return (
    <div className="relative bg-white shadow rounded-lg overflow-hidden">
      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(recipe._id);
          }}
          className="absolute top-2 right-2 text-red-600 bg-white border border-red-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 hover:text-white transition duration-300 z-10"
          aria-label="Remove Recipe"
        >
          &times;
        </button>
      )}
      <Link href={`/recipes/detail/${recipe._id}`} legacyBehavior>
        <a className="bg-white shadow rounded-lg overflow-hidden">
          <img
            src={recipe.recipeImage} 
            alt={recipe.recipeName}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
          <h3 className="font-bold text-lg">{recipe.recipeName}</h3>
          <p className="text-sm text-gray-500">
            {recipe.ingredients.length} ingredients •{" "}
            {recipe.makingTime.hours > 0
              ? `${recipe.makingTime.hours} hr${recipe.makingTime.minutes > 0 ? ` ${recipe.makingTime.minutes} min` : ""}`
              : `${recipe.makingTime.minutes} min`}
          </p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default RecipeCard;