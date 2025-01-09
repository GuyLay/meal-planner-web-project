// pages/api/recipes/user-recipes.js
import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.query;

  try {
    const { db } = await connectToDatabase();
    const recipes = await db.collection("recipes")
      .find({ creator: email })
      .toArray();

    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}