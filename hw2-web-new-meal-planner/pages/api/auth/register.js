import { connectToDatabase } from "../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, foodPreferences, profileImage } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const { db } = await connectToDatabase();

      const result = await db.collection("users").insertOne({
        _id: email,
        firstName,
        lastName,
        email,
        password,
        foodPreferences,
        profileImage, // Add this field
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}