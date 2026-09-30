import { Food } from "../../model/food.js";

export const updateFood = async (req, res) => {
  console.log("update food", req.body.foodCategory);
  const { foodName, foodPrice, ingredients, foodCategory, id } = req.body;

  try {
    const food = await Food.findByIdAndUpdate(
      id,
      {
        foodName,
        foodPrice,
        ingredients,
        foodCategory,
      },
      { new: true }, // Returns the updated document instead of the old one
    );

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    console.log("food", food);
    res.status(200).json({ message: "Successful updateFood", food });
  } catch (err) {
    res.status(500).json({ message: err.message }); // Changed 501 to 500 Internal Server Error
  }
};
