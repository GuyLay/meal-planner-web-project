import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { listId, userId } = req.query;

  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection("shopping-lists").deleteOne({
      _id: new ObjectId(listId),
      userId: userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Shopping list not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete shopping list" });
  }
}