import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = req.query;
  console.log("API: Received request for userId:", userId);

  try {
    const { db } = await connectToDatabase();
    
    // Log the query we're about to make
    console.log("API: Querying shopping-lists with userId:", userId);
    
    // First check if the collection exists
    const collections = await db.listCollections().toArray();
    console.log("API: Available collections:", collections.map(c => c.name));

    const shoppingLists = await db
      .collection("shopping-lists")
      .find({ userId })
      .toArray();

    console.log("API: Found shopping lists:", shoppingLists);

    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch shopping list" });
  }
}