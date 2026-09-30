import mongoose, { Schema } from "mongoose";

const foodCategoryShema = new Schema(
  { categoryName: { type: String, required: true } },
  {
    timestamps: true,
  },
);

export const foodCategory = mongoose.model("FoodCategory", foodCategoryShema);
