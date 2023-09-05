import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [2, "minLength is 2 letter"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "email is unique "],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "name is required"],
    },
    age: { type: Number, required: [true, "age is required"] },
    phone: { type: String, required: [true, "phone is required"] },
    role: { type: String, default: "User", enum: ["User", "Admin"] },
    confirmed: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    code: { type: String, default: null },
    changePassAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);
export default userModel;
