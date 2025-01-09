import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  const { category } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { db } = await connectToDatabase();

    const recipes =
      category === "all"
        ? await db.collection("recipes").find({}).toArray()
        : await db
            .collection("recipes")
            .find({ recipeCategory: category })
            .toArray();

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
}
