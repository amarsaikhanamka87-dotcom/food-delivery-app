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
import { Plus } from "../_icons/plus-icon";
import { FoodCard } from "../admin/_components/food-card";
import { PostFood } from "../admin/_components/postFood";
import { XIcon } from "lucide-react";

export const DishesCategory = () => {
  const [category, setCategory] = useState([]);
  const [categoryValue, setCategoryValue] = useState("");
  const [activeId, setActiveId] = useState(null);

  const [selectedCategoty, setSelectedCategoty] = useState();
  const [open, setOpen] = useState(false);

  //post
  const addCategory = async () => {
    try {
      const resCategory = await server.post("/foodCategory", {
        categoryName: categoryValue,
      });
      //console.log("resCategory", resCategory);
      setCategoryValue("");
      setOpen(false);
    } catch (err) {
      console.log("error", err);
    }
  };

  //get
  const getCategories = async () => {
    try {
      const resGet = await server.get("foodCategory", {});
      setCategory(resGet.data.category);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleCategory = async (id) => {
    try {
      const response = await server.get(`food/${id}`, {});
      setSelectedCategoty(response.data.foods);
      setActiveId(id);
    } catch (err) {
      console.log("error", err);
    }
  };
  console.log("selectedCategory", selectedCategoty);

  const deleteCategory = async (id) => {
    try {
      await server.delete("/foodCategory", { data: { id } });
      if (activeId === id) {
        setActiveId(null);
        setSelectedCategoty([]);
      }
      getCategories();
    } catch (err) {
      console.log("deleteCategory", err);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="p-10  bg-gray-50 flex-col ">
      <div className="flex flex-col gap-6 mx-auto">
        <div className="flex gap-5 bg-white border border-gray-200 shadow-md shadow-gray-300/50 rounded-3xl px-6 py-10 hover:shadow-lg transition-shadow">
          <span className="text-xl font-semibold text-gray-800">
            Dishes Category
          </span>
          <div className="flex gap-2">
            {category?.map((item) => (
              <div
                key={item._id}
                className={`border rounded-2xl p-2 flex gap-2 cursor-pointer ${
                  activeId === item._id ? "border-red-500" : "border-gray-200"
                }`}
                onClick={() => handleCategory(item._id)}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCategory(item._id);
                  }}>
                  <XIcon />
                </button>
                {item.categoryName}
              </div>
            ))}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="group focus:outline-none">
                <Plus />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Add new category
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Category name
                </DialogDescription>
              </DialogHeader>

              <input
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
                placeholder="e.g. Appetizers"
                className="w-full mt-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />

              <button
                onClick={addCategory}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors duration-150">
                Add category
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        {selectedCategoty?.map((category) => (
          <div className=" bg-white border border-gray-200 shadow-md shadow-gray-300/50 rounded-3xl px-6 py-8 hover:shadow-lg transition-shadow">
            <div className="grid grid-cols-6 gap-5">
              <h1>{category.foodCategory.categoryName}</h1>
              <PostFood />
              <FoodCard
                price={category.foodPrice}
                ingredients={category.ingredients}
                name={category.foodName}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
