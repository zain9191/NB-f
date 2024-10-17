// src/components/MealForm/MealForm.jsx
import React, { useEffect, useContext, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import NutritionalInfoForm from "../forms/NutritionalInfoForm";
import ContactInfoForm from "../forms/ContactInfoForm";
import AddressSelector from "../AddressSelector/AddressSelector";
import { prepareMealData, isValidObjectId } from "../../utils/validationUtils";
import api from "../../utils/api";

const MealForm = () => {
  const methods = useForm();
  const { handleSubmit, register, setValue, watch, reset } = methods;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { mealId } = useParams();
  console.log("Meal ID:", mealId);

  const [loading, setLoading] = useState(false);
  const [authorizationChecked, setAuthorizationChecked] = useState(false);

  const selectedAddressId = watch("addressId");

  useEffect(() => {
    const fetchMeal = async () => {
      if (mealId) {
        setLoading(true);
        try {
          const response = await api.get(`/api/meals/${mealId}`);
          if (response.success) {
            const fetchedMeal = response.data;

            // Check if the current user is the creator of the meal
            const creatorId =
              typeof fetchedMeal.createdBy === "object" &&
              fetchedMeal.createdBy !== null
                ? fetchedMeal.createdBy._id
                : fetchedMeal.createdBy;

            if (creatorId.toString() !== user._id.toString()) {
              alert("You are not authorized to edit this meal.");
              navigate("/profile");
              return;
            }

            // Process fetchedMeal to match form fields
            const processedMeal = {
              ...fetchedMeal,
              ingredients: Array.isArray(fetchedMeal.ingredients)
                ? fetchedMeal.ingredients.join(", ")
                : fetchedMeal.ingredients || "",
              tags: Array.isArray(fetchedMeal.tags)
                ? fetchedMeal.tags.join(", ")
                : fetchedMeal.tags || "",
              dietaryRestrictions: Array.isArray(
                fetchedMeal.dietaryRestrictions
              )
                ? fetchedMeal.dietaryRestrictions.join(", ")
                : fetchedMeal.dietaryRestrictions || "",
              paymentOptions: Array.isArray(fetchedMeal.paymentOptions)
                ? fetchedMeal.paymentOptions.join(", ")
                : fetchedMeal.paymentOptions || "",
              pickupDeliveryOptions: Array.isArray(
                fetchedMeal.pickupDeliveryOptions
              )
                ? fetchedMeal.pickupDeliveryOptions.join(", ")
                : fetchedMeal.pickupDeliveryOptions || "",
              nutritionalInfo: {
                calories: fetchedMeal.nutritionalInfo?.calories || "",
                protein: fetchedMeal.nutritionalInfo?.protein || "",
                fat: fetchedMeal.nutritionalInfo?.fat || "",
                carbs: fetchedMeal.nutritionalInfo?.carbs || "",
                vitamins: Array.isArray(fetchedMeal.nutritionalInfo?.vitamins)
                  ? fetchedMeal.nutritionalInfo.vitamins.join(", ")
                  : fetchedMeal.nutritionalInfo?.vitamins || "",
              },
              contactInformation: {
                email: fetchedMeal.contactInformation?.email || "",
                phone: fetchedMeal.contactInformation?.phone || "",
              },
              addressId: fetchedMeal.address?._id || "",
              expirationDate: fetchedMeal.expirationDate
                ? fetchedMeal.expirationDate.split("T")[0]
                : "",
              preparationDate: fetchedMeal.preparationDate
                ? fetchedMeal.preparationDate.split("T")[0]
                : "",
            };

            // Populate form with existing data
            reset(processedMeal);
            setAuthorizationChecked(true);
          } else {
            alert(response.msg || "Failed to fetch meal data.");
            navigate("/profile");
          }
        } catch (error) {
          console.error("Error fetching meal data:", error);
          alert("Error fetching meal data.");
          navigate("/profile");
        } finally {
          setLoading(false);
        }
      } else {
        // We are in create mode, reset form
        reset();
        setAuthorizationChecked(true);
      }
    };

    if (user) {
      fetchMeal();
    } else {
      // If user is not logged in, redirect to login
      alert("Please log in to create or edit a meal.");
      navigate("/login");
    }
  }, [mealId, reset, navigate, user]);

  const onSubmit = async (data) => {
    if (!data.addressId) {
      alert("Please select a valid address using the address selector.");
      return;
    }

    if (!isValidObjectId(data.addressId)) {
      alert("Invalid Address ID.");
      return;
    }

    try {
      // Destructure to exclude unwanted fields
      const {
        createdAt,
        updatedAt,
        __v,
        _id,
        createdBy,
        address,
        ...validData // Contains all other fields except the destructured ones
      } = prepareMealData(data);

      // Ensure numeric fields are parsed correctly
      validData.price = parseFloat(validData.price) || 0;
      validData.sellerRating = parseFloat(validData.sellerRating) || 0;
      validData.quantityAvailable =
        parseInt(validData.quantityAvailable, 10) || 0;

      const formData = new FormData();

      for (let key in validData) {
        if (key === "images" && data.images instanceof FileList) {
          Array.from(data.images).forEach((image) => {
            formData.append("images", image);
          });
        } else if (["nutritionalInfo", "contactInformation"].includes(key)) {
          formData.append(key, JSON.stringify(validData[key]));
        } else if (["expirationDate", "preparationDate"].includes(key)) {
          // Convert dates to ISO strings
          formData.append(key, new Date(validData[key]).toISOString());
        } else {
          formData.append(key, validData[key].toString());
        }
      }

      let response;
      if (mealId) {
        // Update existing meal
        response = await api.put(`/api/meals/${mealId}`, formData);
      } else {
        // Create new meal
        response = await api.post("/api/meals", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Handle the response based on Axios's default structure
      if (response.success) {
        alert(`Meal ${mealId ? "updated" : "created"} successfully`);
        navigate("/profile");
      } else {
        alert(
          response.data.msg || `Failed to ${mealId ? "update" : "create"} meal.`
        );
      }
    } catch (error) {
      console.error(`Error ${mealId ? "updating" : "creating"} meal:`, error);
      alert(
        `Error ${mealId ? "updating" : "creating"} meal: ` +
          (error.response?.data?.msg || error.message || error)
      );
    }
  };

  if (loading || !authorizationChecked) {
    return <p>Loading meal data...</p>;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="meal-form">
        <h2>{mealId ? "Edit Meal" : "Create a Meal"}</h2>

        {/* Meal Name */}
        <input
          type="text"
          {...register("name", { required: "Meal name is required" })}
          placeholder="Meal Name"
        />
        {methods.formState.errors.name && (
          <p className="error">{methods.formState.errors.name.message}</p>
        )}

        {/* Description */}
        <textarea
          {...register("description", { required: "Description is required" })}
          placeholder="Description"
        ></textarea>
        {methods.formState.errors.description && (
          <p className="error">
            {methods.formState.errors.description.message}
          </p>
        )}

        {/* Price */}
        <input
          type="number"
          step="0.01"
          min="0"
          {...register("price", { required: "Price is required" })}
          placeholder="Price"
        />
        {methods.formState.errors.price && (
          <p className="error">{methods.formState.errors.price.message}</p>
        )}

        {/* Ingredients */}
        <input
          type="text"
          {...register("ingredients", { required: "Ingredients are required" })}
          placeholder="Ingredients (comma-separated)"
        />
        {methods.formState.errors.ingredients && (
          <p className="error">
            {methods.formState.errors.ingredients.message}
          </p>
        )}

        {/* Category */}
        <input
          type="text"
          {...register("category", { required: "Category is required" })}
          placeholder="Category"
        />
        {methods.formState.errors.category && (
          <p className="error">{methods.formState.errors.category.message}</p>
        )}

        {/* Cuisine */}
        <input
          type="text"
          {...register("cuisine", { required: "Cuisine is required" })}
          placeholder="Cuisine"
        />
        {methods.formState.errors.cuisine && (
          <p className="error">{methods.formState.errors.cuisine.message}</p>
        )}

        {/* Portion Size */}
        <input
          type="text"
          {...register("portionSize", { required: "Portion size is required" })}
          placeholder="Portion Size"
        />
        {methods.formState.errors.portionSize && (
          <p className="error">
            {methods.formState.errors.portionSize.message}
          </p>
        )}

        {/* Nutritional Information */}
        <NutritionalInfoForm />

        {/* Dietary Restrictions */}
        <input
          type="text"
          {...register("dietaryRestrictions")}
          placeholder="Dietary Restrictions (comma-separated)"
        />

        {/* Expiration Date */}
        <input
          type="date"
          {...register("expirationDate", {
            required: "Expiration date is required",
          })}
          placeholder="Expiration Date"
        />
        {methods.formState.errors.expirationDate && (
          <p className="error">
            {methods.formState.errors.expirationDate.message}
          </p>
        )}

        {/* Preparation Date */}
        <input
          type="date"
          {...register("preparationDate", {
            required: "Preparation date is required",
          })}
          placeholder="Preparation Date"
        />
        {methods.formState.errors.preparationDate && (
          <p className="error">
            {methods.formState.errors.preparationDate.message}
          </p>
        )}

        {/* Pickup/Delivery Options */}
        <input
          type="text"
          {...register("pickupDeliveryOptions", {
            required: "Pickup/Delivery options are required",
          })}
          placeholder="Pickup/Delivery Options"
        />
        {methods.formState.errors.pickupDeliveryOptions && (
          <p className="error">
            {methods.formState.errors.pickupDeliveryOptions.message}
          </p>
        )}

        {/* Address Selector */}
        <h3>Address</h3>
        <AddressSelector
          onAddressSelect={(id) => setValue("addressId", id)}
          selectedAddressId={selectedAddressId}
        />

        {selectedAddressId && (
          <p>
            <strong>Selected Address ID:</strong> {selectedAddressId}
          </p>
        )}

        {/* Packaging Information */}
        <input
          type="text"
          {...register("packagingInformation")}
          placeholder="Packaging Information"
        />

        {/* Health & Safety Compliance */}
        <input
          type="text"
          {...register("healthSafetyCompliance")}
          placeholder="Health & Safety Compliance"
        />

        {/* Contact Information */}
        <ContactInfoForm />

        {/* Payment Options */}
        <input
          type="text"
          {...register("paymentOptions", {
            required: "Payment options are required",
          })}
          placeholder="Payment Options (comma-separated)"
        />
        {methods.formState.errors.paymentOptions && (
          <p className="error">
            {methods.formState.errors.paymentOptions.message}
          </p>
        )}

        {/* Preparation Method */}
        <input
          type="text"
          {...register("preparationMethod")}
          placeholder="Preparation Method"
        />

        {/* Cooking Instructions */}
        <input
          type="text"
          {...register("cookingInstructions")}
          placeholder="Cooking Instructions"
        />

        {/* Additional Notes */}
        <input
          type="text"
          {...register("additionalNotes")}
          placeholder="Additional Notes"
        />

        {/* Tags */}
        <input
          type="text"
          {...register("tags", { required: "Tags are required" })}
          placeholder="Tags (comma-separated)"
        />
        {methods.formState.errors.tags && (
          <p className="error">{methods.formState.errors.tags.message}</p>
        )}

        {/* Seller Rating */}
        <input
          type="number"
          min="1"
          max="5"
          {...register("sellerRating")}
          placeholder="Seller Rating (1-5)"
        />

        {/* Quantity Available */}
        <input
          type="number"
          min="1"
          {...register("quantityAvailable", {
            required: "Quantity is required",
          })}
          placeholder="Quantity Available"
        />
        {methods.formState.errors.quantityAvailable && (
          <p className="error">
            {methods.formState.errors.quantityAvailable.message}
          </p>
        )}

        {/* Discounts/Promotions */}
        <input
          type="text"
          {...register("discountsPromotions")}
          placeholder="Discounts/Promotions"
        />

        {/* Images */}
        <input type="file" {...register("images")} multiple accept="image/*" />

        {/* Submit Button */}
        <button type="submit">{mealId ? "Update Meal" : "Create Meal"}</button>
      </form>
    </FormProvider>
  );
};

export default MealForm;
