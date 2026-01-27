import mongoose from "mongoose";
import { asyncHandler } from "../../../utils/AsyncHandler.js";
import ApiResponse from "../../../utils/ApiReponse.js";
import ApiError from "../../../utils/ApiError.js";

import {
  createCategoryService,
  getCategoriesService,
  updateCategoryService,
  deleteCategoryService,
} from "../../../services/admin/settings/cannedCategory.service.js";

/**
 * 📖 GET ALL CATEGORIES
 * Roles:
 * - SUPER_ADMIN
 * - ADMIN
 * - ADMIN_STAFF
 */
export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await getCategoriesService();

  return res.status(200).json(
    ApiResponse.success(categories, "Categories fetched successfully")
  );
});

/**
 * ➕ CREATE CATEGORY
 * Role:
 * - SUPER_ADMIN
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Category name is required");
  }

  const category = await createCategoryService({
    name: name.trim(),
  });

  return res.status(201).json(
    ApiResponse.success(category, "Category created successfully")
  );
});

/**
 * ✏️ UPDATE CATEGORY
 * Role:
 * - SUPER_ADMIN
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID");
  }

  if (!name || typeof name !== "string") {
    throw new ApiError(400, "Category name is required");
  }

  const updatedCategory = await updateCategoryService(id, {
    name: name.trim(),
  });

  return res.status(200).json(
    ApiResponse.success(updatedCategory, "Category updated successfully")
  );
});

/**
 * 🗑️ DELETE CATEGORY
 * Role:
 * - SUPER_ADMIN
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid category ID");
  }

  await deleteCategoryService(id);

  return res.status(200).json(
    ApiResponse.success(null, "Category deleted successfully")
  );
});
