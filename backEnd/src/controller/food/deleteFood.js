import { Food } from "../../model/food.js";

export const deleteFood = async (req, res) => {
  console.log("delete req body", req.body);
  const { id } = req.body;
  try {
    const food = await Food.findByIdAndDelete(id);
    console.log("after deleted food", food);
    res.status(200).json({ message: "successFully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
