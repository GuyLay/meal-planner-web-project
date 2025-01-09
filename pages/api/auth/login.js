import { connectToDatabase } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const { db } = await connectToDatabase();

      // Find user by email
      const user = await db.collection("users").findOne({ _id: email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Compare password
      if (user.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Exclude sensitive information (e.g., password) from the response
      const userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        foodPreferences: user.foodPreferences,
        profileImage: user.profileImage
      };

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: userData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}