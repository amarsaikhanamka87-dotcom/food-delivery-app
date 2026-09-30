import { Food } from "../../model/food.js";

export const createFood = async (req, res) => {
  console.log("post createFood", req.body);
  const { foodName, foodPrice, ingredients, foodCategory } = req.body;

  try {
    const food = await Food.create({
      foodName: foodName,
      foodPrice: foodPrice,
      ingredients: ingredients,
      foodCategory: foodCategory,
    });
    res.status(200).json({ messange: "success" }, food);
  } catch (error) {
    console.log(error);
    res.status(500).json({ messange: error.messange });
  }
};
