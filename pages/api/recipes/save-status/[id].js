import { connectToDatabase } from "../../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;
  const email = req.headers['user-email'];

  try {
    const { db } = await connectToDatabase();
    const savedRecipe = await db.collection("saved").findOne({
      userId: email,
      recipeId: id
    });

    res.status(200).json({ isSaved: !!savedRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to check save status" });
  }
}