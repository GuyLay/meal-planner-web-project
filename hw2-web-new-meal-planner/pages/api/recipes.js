import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      recipeName,
      recipeCategory,
      makingTime,
      nutrition,
      ingredients,
      instructions,
      recipeImage,
    } = req.body;

    try {
      await client.connect();
      const database = client.db(process.env.MONGO_DB_NAME);
      const recipesCollection = database.collection("recipes");

      // Create a recipe object for the database
      const newRecipe = {
        recipeName,
        recipeCategory,
        makingTime,
        nutrition,
        ingredients,
        instructions,
        recipeImage,
      };

      // Save the object in the database
      const result = await recipesCollection.insertOne(newRecipe);

      res.status(201).json({
        message: "Recipe saved successfully!",
        recipeId: result.insertedId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving recipe." });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}