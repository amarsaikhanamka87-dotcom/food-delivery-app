import { Router } from "express";
import { getCategories } from "../../controller/food-Category/get.js";
import { createCategories } from "../../controller/food-Category/post.js";
import { updateCategories } from "../../controller/food-Category/put.js";
import { deleteCategories } from "../../controller/food-Category/delete.js";
import { requireToken } from "../../middleware/require-token.js";
import { requireAdmin } from "../../middleware/require-admin.js";

export const FoodCategoryRouter = Router();

FoodCategoryRouter.get("/", getCategories)
  .post("/", createCategories)
  .put("/", requireToken, requireAdmin, updateCategories)
  .delete("/", requireToken, requireAdmin, deleteCategories);
