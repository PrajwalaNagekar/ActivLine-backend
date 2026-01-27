import ApiError from "../../../utils/ApiError.js";
import CannedCategory from "../../../models/admin/Settings/cannedCategory.model.js";

/**
 * 📖 GET ALL CATEGORIES
 */
export const getCategoriesService = async () => {
  return CannedCategory.find({ isActive: true })
    .sort({ createdAt: -1 });
};

/**
 * ➕ CREATE CATEGORY
 */
export const createCategoryService = async ({ name }) => {
  const exists = await CannedCategory.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (exists) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await CannedCategory.create({
    name,
  });

  return category;
};

/**
 * ✏️ UPDATE CATEGORY
 */
export const updateCategoryService = async (id, { name }) => {
  const category = await CannedCategory.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Prevent duplicate names
  const exists = await CannedCategory.findOne({
    _id: { $ne: id },
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (exists) {
    throw new ApiError(409, "Category with this name already exists");
  }

  category.name = name;
  await category.save();

  return category;
};

/**
 * 🗑️ DELETE CATEGORY (SOFT DELETE)
 */
export const deleteCategoryService = async (id) => {
  const category = await CannedCategory.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.isActive = false;
  await category.save();

  return true;
};
