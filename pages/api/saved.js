import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const savedCollection = db.collection("saved");
    const recipesCollection = db.collection("recipes");

    if (method === "GET") {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Fetch saved recipes for the given userId, sorted by `createdAt` descending
      const savedItems = await savedCollection.find({ userId }).sort({createsAt: -1 }).toArray();
      
      if (!savedItems.length) {
        return res.status(200).json([]); // No saved recipes for this user
      }

      // Extract recipeIds and convert to ObjectId
      const recipeIds = savedItems.map((item) => new ObjectId(item.recipeId));

      // Fetch recipes from the `recipes` collection
      const recipes = await recipesCollection
        .find({ _id: { $in: recipeIds } })
        .toArray();

      return res.status(200).json(recipes);
    } 

    if (method === "DELETE") {
      const { userId, recipeId } = req.query;

      if (!userId || !recipeId) {
        return res.status(400).json({ error: "User ID and Recipe ID are required" });
      }

      // Handle deletion logic
      const filter = {
        userId,
        recipeId,
      };

      const result = await savedCollection.deleteOne(filter);

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Recipe removed from saved list" });
      } else {
        return res.status(404).json({ error: "Recipe not found in saved list" });
      }
    }

    // If method is not allowed
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).json({ error: `Method ${method} not allowed` });
  } catch (error) {
    console.error("Error in API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}