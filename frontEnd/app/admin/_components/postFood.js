"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { server } from "../../api/api";
import { Plus } from "../../_icons/plus-icon";

export const PostFood = () => {
  const [foodCardValues, setFoodCardValues] = useState({
    foodName: "",
    foodPrice: "",
    ingredients: "",
    category: "",
    foodImg: "",
  });

  const [category, setCategory] = useState({});
  const [foodNameError, setFoodNameError] = useState();
  const [foodPriceError, setFoodPriceError] = useState();
  const [ingredientsError, setIngredientsError] = useState();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFoodCardValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validatefoodName = () => {
    if (!foodCardValues.foodName) {
      setFoodNameError("error");
      return true;
    } else {
      setFoodNameError("");
      return false;
    }
  };

  const validatePrice = () => {
    if (!foodCardValues.foodPrice) {
      setFoodPriceError("error must have");
      return true;
    } else if (foodCardValues.foodPrice <= 0) {
      setFoodPriceError("must have greater than 0");
      return true;
    } else {
      setFoodPriceError("");
      return false;
    }
  };

  const validateIngredients = () => {
    if (!foodCardValues.ingredients) {
      setIngredientsError("must have ingredients");
      return true;
    } else {
      setIngredientsError("");
      return false;
    }
  };

  // categoty GET
  const getCategories = async () => {
    try {
      const response = await server.get("/foodCategory", {});
      setCategory(response.data.category);
    } catch (err) {
      console.log("error", err);
    }
  };

  // post FOOD
  const addFood = async () => {
    const nameError = validatefoodName(foodCardValues.foodName);
    const priceError = validatePrice(foodCardValues.priceError);
    const ingredError = validateIngredients(foodCardValues.ingredients);

    if (!nameError || !priceError || !ingredError) {
      try {
        const resFood = await server.post("/food", {
          foodName: foodCardValues.foodName,
          foodPrice: foodCardValues.foodPrice,
          ingredients: foodCardValues.ingredients,
          foodCategory: foodCardValues.category,
          foodImg: foodCardValues.foodImg,
        });
      } catch (err) {
        console.log("error", err);
      }
    }
  };

  //   const [isOpen, setIsOpen] = useState(false);
  //   const [selectedFood, setSelectedFood] = useState({});

  //   const handleFoodClick = async (food) => {
  //     setSelectedFood(food);
  //     setIsOpen(true);
  //   };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className=" flex gap-1  items-center justify-center p-8 rounded-2xl outline-red-500 outline-dashed">
      add New Dishes to.
      <Dialog>
        <DialogTrigger>
          <Plus />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new dish to</DialogTitle>
            <DialogDescription className="flex gap-2">
              <div className="flex flex-col gap-1 ">
                Food name
                <input
                  id="foodName"
                  onChange={handleInputChange}
                  value={foodCardValues.foodName}
                  placeholder="type food name"
                  className="border rounded-2xl p-3"
                />
                {foodNameError && (
                  <div className="text-red-500">{foodNameError}</div>
                )}
              </div>
              <div className="flex flex-col gap-1 ">
                Food price
                <input
                  id="foodPrice"
                  onChange={handleInputChange}
                  placeholder="Enter price..."
                  className="border rounded-2xl p-3"
                />
                {foodPriceError && (
                  <div className="text-red-500">{foodPriceError}</div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <label className="font-semibold block mb-1">Category</label>
          <select
            id="category"
            value={foodCardValues.category}
            onChange={handleInputChange}
            className="border rounded-xl p-2"
          >
            <option value="">Select category</option>
            {Array.isArray(category) &&
              category.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name || cat.categoryName}
                </option>
              ))}
          </select>
          <div className="flex flex-col gap-2">
            ingredients
            <input
              id="ingredients"
              onChange={handleInputChange}
              value={foodCardValues.ingredients}
              placeholder="List ingredients..."
              className="border rounded-2xl h-20 p-5"
            />
            {ingredientsError && (
              <div className="text-red-500">{ingredientsError}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            Food image
            <div className="border p-10 bg-gray-50">
              <input
                id="foodImg"
                onChange={handleInputChange}
                placeholder="Choose a file or drag & drop it here"
                value={foodCardValues.foodImg}
              />
            </div>
          </div>
          <button
            onClick={addFood}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors duration-150"
          >
            add Dish
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
