import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { userId, mealPlan } = req.body;

    if (!userId || !mealPlan) {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    try {
      const { db } = await connectToDatabase();
      await db.collection("meal-plans").updateOne(
        { userId },
        { $set: { mealPlan, updatedAt: new Date() } },
        { upsert: true }
      );

      res.status(200).json({ message: "Meal plan saved successfully!" });
    } catch (error) {
      console.error("Error saving meal plan:", error);
      res.status(500).json({ error: "Failed to save meal plan." });
    }
  } else if (method === "DELETE") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    try {
      const { db } = await connectToDatabase();
      const result = await db.collection("meal-plans").deleteOne({ userId });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: "Meal plan deleted successfully!" });
      } else {
        res.status(404).json({ error: "Meal plan not found." });
      }
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      res.status(500).json({ error: "Failed to delete meal plan." });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).json({ error: `Method ${method} not allowed` });
  }
}