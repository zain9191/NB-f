// src/utils/validationUtils.js
import { splitAndTrim } from './stringUtils';

/**
 * @param {string} id - The ObjectId string to validate.
 * @returns {boolean} - True if valid, else false.
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * @param {object} mealData - The raw meal data from the form.
 * @returns {object} - The processed meal data ready for API submission.
 */
export const prepareMealData = (mealData) => {
  const {
    nutritionalInfo = {},
    contactInformation = {},
    // images,
    ...rest
  } = mealData;

  return {
    ...rest,
    ingredients: splitAndTrim(mealData.ingredients || ""),
    tags: splitAndTrim(mealData.tags || ""),
    dietaryRestrictions: splitAndTrim(mealData.dietaryRestrictions || ""),
    paymentOptions: splitAndTrim(mealData.paymentOptions || ""),
    pickupDeliveryOptions: splitAndTrim(mealData.pickupDeliveryOptions || ""),
    discountsPromotions: splitAndTrim(mealData.discountsPromotions || ""),
    nutritionalInfo: {
      calories: parseFloat(nutritionalInfo.calories) || 0,
      protein: parseFloat(nutritionalInfo.protein) || 0,
      fat: parseFloat(nutritionalInfo.fat) || 0,
      carbs: parseFloat(nutritionalInfo.carbs) || 0,
      vitamins: splitAndTrim(nutritionalInfo.vitamins || ""),
    },
    contactInformation: {
      email: contactInformation.email || "",
      phone: contactInformation.phone || "",
    },
    price: parseFloat(rest.price) || 0,
    sellerRating: parseFloat(rest.sellerRating) || 0,
    quantityAvailable: parseInt(rest.quantityAvailable, 10) || 0,
    // Exclude createdAt, updatedAt, __v here if they're part of mealData
  };
};