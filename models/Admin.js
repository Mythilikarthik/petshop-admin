import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema, "admin");
