import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    foodName: { type: String, required: true },
    foodPrice: { type: String, required: true },
    foodCategory: {
      type: mongoose.Schema.ObjectId,
      ref: "FoodCategory",
      required: [true, "Please Select a Category"],
    },
    foodImg: { type: String },
    ingredients: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Food = mongoose.model("Food", foodSchema);
