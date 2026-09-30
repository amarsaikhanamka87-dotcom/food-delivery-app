import { foodCategory } from "../../model/food-category.js";

export const createCategories = async (req, res) => {
  const { categoryName } = req.body;

  try {
    const category = await foodCategory.create({
      categoryName: categoryName,
    });

    res.status(200).json({ messange: "Success createCategoty", category });
  } catch (err) {
    res.status(500).json({ messange: err.message });
  }
};
