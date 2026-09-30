import { Food } from "../../model/food.js";

export const getFood = async (req, res) => {
  try {
    const food = await Food.find().populate("foodCategory");
    res.status(200).json({ messange: "success getFood", food });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messange: err.messange });
  }
};

export const callWithCategoryId = async (req, res) => {
  const { id } = req.params;
  console.log(id, "this is my id");

  try {
    const foods = await Food.find({ foodCategory: id }).populate(
      "foodCategory",
    );

    console.log("foods", foods);
    res.status(200).json({ messange: "success", foods });
  } catch (err) {
    res.status(500).json({ messange: err.messange });
  }
};
