// pages/api/recipes/delete.js
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { recipeId, creator } = req.query;

  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("recipes").deleteOne({
      _id: new ObjectId(recipeId),
      creator: creator
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
}