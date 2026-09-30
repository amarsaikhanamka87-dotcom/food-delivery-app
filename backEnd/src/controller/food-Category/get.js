import { foodCategory } from "../../model/food-category.js";

export const getCategories = async (req, res) => {
  try {
    const category = await foodCategory.find();

    res.status(200).json({ messange: "Success getCategoty", category });
  } catch (err) {
    res.status(500).json({ messange: err.messange });
  }
};
