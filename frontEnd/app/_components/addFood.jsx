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
import { server } from "../api/api";

import { DeleteIcon } from "../_icons/delete-icon";
import { PostFood } from "../admin/_components/postFood";
import { FoodCard } from "../admin/_components/food-card";

export const AddFood = () => {
  const [foods, setFoods] = useState();

  const [category, setCategory] = useState({});

  // categoty
  const getCategories = async () => {
    try {
      const response = await server.get("/foodCategory", {});
      setCategory(response.data.category);
    } catch (err) {
      console.log("error", err);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState({});

  //GET
  const getFood = async () => {
    try {
      const foodResponse = await server.get("/food", {});
      setFoods(foodResponse.data.food);
    } catch (error) {
      console.log("error", error);
    }
  };

  //delete
  const deleteFood = async (id) => {
    console.log("id", id);
    try {
      const ResDeleteFood = await server.delete("/food", {
        data: { id },
      });
      console.log("deleteFood", ResDeleteFood);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleFoodClick = (food) => {
    setSelectedFood({
      ...food,

      foodCategory: food.foodCategory?._id ?? food.foodCategory ?? "",
    });
    setIsOpen(true);
  };

  // put
  const updateFood = async () => {
    try {
      const response = await server.put("/food", {
        id: selectedFood.id,
        foodName: selectedFood.foodName,
        foodPrice: selectedFood.foodPrice,
        ingredients: selectedFood.ingredients,
        foodCategory: selectedFood.foodCategory,
      });
      setIsOpen(false);
    } catch (err) {
      console.log("error", err);
    }
  };

  console.log("setSelectedFood", selectedFood);

  useEffect(() => {
    getFood();
    getCategories();
  }, []);

  return (
    <div className="p-10  bg-gray-50">
      <div className="flex gap-5   bg-white border border-gray-200 shadow-md shadow-gray-300/50 rounded-3xl px-6 py-8 hover:shadow-lg transition-shadow">
        <div className="grid grid-cols-6 gap-5">
          <PostFood />
          {foods?.map((food) => (
            <div key={food.id} onClick={() => handleFoodClick(food)}>
              <FoodCard
                price={food.foodPrice}
                ingredients={food.ingredients}
                name={food.foodName}
              />
            </div>
          ))}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dishes info</DialogTitle>

            <DialogDescription className="flex flex-col">
              <div className="font-semibold block mb-1">Dish name</div>
              <input className="border  pl-2.5" value={selectedFood.foodName} />
            </DialogDescription>
            <DialogDescription className="flex flex-col">
              <label className="font-semibold block mb-1">Category</label>
              <select>
                {Array.isArray(category) &&
                  category.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name || cat.categoryName}
                    </option>
                  ))}
              </select>
            </DialogDescription>

            <DialogDescription className="flex flex-col">
              <div className="font-semibold block mb-1">Ingredients</div>
              <input
                className="border pl-2.5 h-15 w-70"
                value={selectedFood.ingredients}
              />
            </DialogDescription>
            <DialogDescription className="flex flex-col gap-2">
              <div className="font-semibold block mb-1">Price</div>
              <input
                className="border  pl-2.5"
                value={selectedFood.foodPrice}
              />
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-between">
            <button onClick={() => deleteFood(selectedFood._id)}>
              <DeleteIcon />
            </button>

            <button
              className="border rounded-2xl p-3 bg-black text-white"
              onClick={updateFood}>
              Save changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
