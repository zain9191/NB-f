import React from "react";
import { useFormContext } from "react-hook-form";

const NutritionalInfoForm = () => {
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend>Nutritional Information</legend>
      <input
        type="number"
        step="0.1"
        min="0"
        {...register("nutritionalInfo.calories", { required: true })}
        placeholder="Calories"
      />
      <input
        type="number"
        step="0.1"
        min="0"
        {...register("nutritionalInfo.protein", { required: true })}
        placeholder="Protein (g)"
      />
      <input
        type="number"
        step="0.1"
        min="0"
        {...register("nutritionalInfo.fat", { required: true })}
        placeholder="Fat (g)"
      />
      <input
        type="number"
        step="0.1"
        min="0"
        {...register("nutritionalInfo.carbs", { required: true })}
        placeholder="Carbs (g)"
      />
      <input
        type="text"
        {...register("nutritionalInfo.vitamins")}
        placeholder="Vitamins (comma-separated)"
      />
    </fieldset>
  );
};

export default NutritionalInfoForm;
