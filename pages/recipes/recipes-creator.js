import { useState, useEffect } from "react";
import Form from "../../components/Form";
import { useRouter } from "next/router";

export default function RecipeCreator() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [ingredients, setIngredients] = useState([
        { ingredientName: "", amount: 0, unit: "Unit" },
    ]);
    const [instructions, setInstructions] = useState([""]);      
    const [recipeName, setRecipeName] = useState("");
    const [recipeCategory, setRecipeCategory] = useState("");
    const [recipeImage, setRecipeImage] = useState(null);
    const [makingTime, setMakingTime] = useState({ hours: 0, minutes: 0 });
    const [nutrition, setNutrition] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
    });

    useEffect(() => {
        const userInfo = localStorage.getItem('user');
        if (!userInfo) {
            router.push('/auth/signin');
            return;
        }
        setUser(JSON.parse(userInfo));
    }, []);

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            { ingredientName: "", amount: 0, unit: "Unit" },
        ]);
    };

    const fixNumber = (value) => {
        // cuting 0 in start
        if (value === 0) return value;
        if (value[0] === "0") {
            value = value.slice(1);
        }
    }

    const removeIngredient = (index) => {
        if (index === 0 && ingredients.length === 1) {
            alert("Recipe must have at least one ingredient");
            return;
        }
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const addInstruction = () => {
        setInstructions([...instructions, ""]);
    };

    const removeInstruction = (index) => {
        if (index === 0 && instructions.length === 1) {
            alert("Recipe must have at least one instruction");
            return;
        }
        setInstructions(instructions.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index, field, value) => {
        if (field === "amount" && value < 0) {
            value = 0;
        }

        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const handleInstructionChange = (index, value) => {
        const updatedInstructions = [...instructions];
        updatedInstructions[index] = value;
        setInstructions(updatedInstructions);
    };

    const handleNutritionChange = (field, value) => {
        setNutrition({ ...nutrition, [field]: value < 0 ? 0 : value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user || !recipeName || !recipeCategory || !recipeImage) {
            alert("Please fill all required fields");
            return;
        }

        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        let base64Image = recipeImage ? await toBase64(recipeImage) : "";

        // Map category to mainCategory
        const categoryToMainCategory = {
            'Main-Dish': 'Main-Dish',
            'Appetizers': 'Appetizer',
            'Salads': 'Salad',
            'Side-Dishes': 'Side-Dish',
            'Soup': 'Soup',
            'Vegetarian': 'Vegetarian'
        };

        const recipeData = {
            recipeName,
            recipeCategory,
            mainCategory: categoryToMainCategory[recipeCategory],
            makingTime,
            nutrition,
            ingredients,
            instructions,
            recipeImage: base64Image,
            creator: user.email
        };

        try {
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(recipeData),
            });
        
            const data = await response.json();
            
            if (response.ok) {
                alert("Recipe saved successfully!");
                router.push('../profile');
            } else {
                console.error("Error details:", data);
                alert(`Error: ${data.error || data.message || "Failed to save recipe"}`);
            }
        } catch (error) {
            console.error("Full error:", error);
            alert("Error saving recipe.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div
                className="max-w-3xl w-full p-6 bg-white rounded-lg flex flex-col justify-center items-center"
                style={{ height: "100%" }}
            >
                <Form
                    onSubmit={handleSubmit}
                    title="Create a Recipe"
                >
                    {/* Recipe Name */}
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Recipe Name
                        </label>
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="Enter recipe name"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Recipe Category */}
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Recipe Category
                        </label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            value={recipeCategory}
                            onChange={(e) => setRecipeCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Main-Dish">Main Dish</option>
                            <option value="appetizers">Appetizers</option>
                            <option value="Salad">Salads</option>
                            <option value="Side-Dishes">Side Dishes</option>
                            <option value="Soup">Soup</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>

                    {/* Recipe Image */}
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Recipe Image
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={(e) => setRecipeImage(e.target.files[0])}
                            required
                        />
                        <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG.</p>
                    </div>

                    {/* Making Time */}
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Preparation Time (HH:MM)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="0"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Hours"
                                value={fixNumber(makingTime.hours)}
                                onChange={(e) =>
                                    setMakingTime({ ...makingTime, hours: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                min="0"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Minutes"
                                value={fixNumber(makingTime.minutes)}
                                onChange={(e) =>
                                    setMakingTime({ ...makingTime, minutes: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-4 flex flex-col">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Ingredients
                        </label>
                        <div id="ingredientsContainer" className="space-y-2">
                            {ingredients.map((ingredient, index) => (
                                <div className="ingredient-row flex space-x-4 items-center relative" key={index}>
                                    <input
                                        type="text"
                                        className="bg-gray-50 w-2/4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Ingredient"
                                        value={ingredient.ingredientName}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "ingredientName", e.target.value)
                                        }
                                        required
                                    />
                                    <input
                                        type="number"
                                        className="bg-gray-50 border w-1/4 border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Amount"
                                        value={fixNumber(ingredient.amount)}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "amount", e.target.value)
                                        }
                                        min="0"
                                        required
                                    />
                                    <select
                                        className="bg-gray-50 w-1/4 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={ingredient.unit}
                                        onChange={(e) =>
                                            handleIngredientChange(index, "unit", e.target.value)
                                        }
                                    >
                                        <option value="">Unit</option>
                                        <option value="grams">Grams</option>
                                        <option value="ml">ml</option>
                                        <option value="cups">Cups</option>
                                        <option value="tablespoon">Tablespoon</option>
                                        <option value="piece">Piece</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="remove-instruction absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-3xl"
                                        aria-label="Remove"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addIngredient}
                            className="flex items-center space-x-1 cursor-pointer font-bold mt-2"
                            style={{ color: "#ff914d" }}
                        >
                            + Add Ingredient
                        </button>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Instructions
                        </label>
                        <div id="instructionsContainer" className="space-y-2">
                            {instructions.map((instruction, index) => (
                                <div className="instruction-row flex items-start space-x-2 relative" key={index}>
                                    <textarea
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        placeholder="Write one or multiple steps"
                                        value={instruction}
                                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeInstruction(index)}
                                        className="remove-instruction absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 text-3xl"
                                        aria-label="Remove"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addInstruction}
                            className="flex items-center space-x-1 cursor-pointer font-bold mt-2"
                            style={{ color: "#ff914d" }}
                        >
                            + Add Step
                        </button>
                    </div>

                    {/* Nutrition */}
                    <div className="mb-4 flex flex-col items-center">
                        <label className="block text-sm font-medium mb-2 text-gray-900">
                            Nutrition
                        </label>
                        <div className="flex flex-col gap-2 w-full">
                            {["calories", "protein", "carbs", "fat"].map((field) => (
                                <div className="flex justify-between items-center" key={field}>
                                    <span className="text-sm font-medium w-1/4 capitalize">
                                        {field}:
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        value={fixNumber(nutrition[field])}
                                        onChange={(e) =>
                                            handleNutritionChange(field, e.target.value)
                                        }
                                    />
                                    <span className="text-sm font-medium pl-2">grams</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button type="submit" className="btn">
                            Submit
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
}