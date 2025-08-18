import { connectDB } from "../lib/db.js";
import Admin from "../models/Admin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { username, password } = req.body;

  try {
    await connectDB();

    const user = await Admin.findOne({ username, password });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        username: user.username,
        token: "dummy-token-123",
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
