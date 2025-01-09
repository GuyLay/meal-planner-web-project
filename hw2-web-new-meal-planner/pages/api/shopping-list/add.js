import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, recipeName, items } = req.body;

  try {
    const { db } = await connectToDatabase();

    await db.collection("shopping-lists").insertOne({
      userId,
      recipeName,
      items,
      createdAt: new Date()
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add to shopping list" });
  }
}