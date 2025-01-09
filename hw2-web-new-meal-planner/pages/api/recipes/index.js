// pages/api/recipes/index.js
import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const recipeData = req.body;

    const result = await db.collection("recipes").insertOne(recipeData);

    res.status(201).json({ 
      message: "Recipe created successfully",
      recipeId: result.insertedId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create recipe" });
  }
}