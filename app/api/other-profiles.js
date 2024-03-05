import User from "@models/user";
import { connectToDB } from "@utils/database";

// Establish database connection
connectToDB();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await connectToDB();

      const users = await User.find().populate("prompts");
      res.status(200).json({ users });
    } catch (error) {
      console.error("Error fetching other profiles:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
