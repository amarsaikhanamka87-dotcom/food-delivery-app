import { Food } from "../../model/food.js";

export const updateFood = async (req, res) => {
  console.log("update food", req.body);
  const { foodName, foodPrice, ingredients, foodCategory } = req.body;

  try {
    const food = await Food.findByIdAndUpdate({
      foodName: foodName,
      foodPrice: foodPrice,
      ingredients: ingredients,
      foodCategory: foodCategory,
    });
    res.status(200).json({ message: "successful updeateFood" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
