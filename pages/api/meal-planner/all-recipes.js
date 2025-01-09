import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const allRecipes = await db.collection("recipes").find({}).toArray();
    res.status(200).json(allRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all recipes" });
  }
}