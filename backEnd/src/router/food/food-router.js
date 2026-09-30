import { Router } from "express";
import { callWithCategoryId, getFood } from "../../controller/food/getFood.js";
import { updateFood } from "../../controller/food/updateFood.js";
import { deleteFood } from "../../controller/food/deleteFood.js";
import { createFood } from "../../controller/food/addFood.js";

export const FoodRouter = Router();

FoodRouter.get("/", getFood)
  .get("/:id", callWithCategoryId)
  .post("/", createFood)
  .put("/", updateFood)
  .delete("/", deleteFood);
