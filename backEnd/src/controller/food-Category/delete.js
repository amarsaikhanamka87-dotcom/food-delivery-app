import { foodCategory } from "../../model/food-category.js";

export const deleteCategories = async (req, res) => {
  const { id } = req.body;

  try {
    const categoty = await foodCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Success delete category", categoty });
  } catch (err) {
    res.status(500).lson({ message: err.message });
  }
};
