import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/auth/register", data);
      const { token, user, msg } = response;

      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
        alert("Registration successful!");
        navigate("/profile");
      } else {
        alert(msg || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response && error.response.data) {
        const { msg, errors: serverErrors } = error.response.data;

        if (serverErrors) {
          serverErrors.forEach(({ field, message }) => {
            setError(field, { type: "server", message });
          });
        }

        if (msg) {
          alert(msg);
        }
      } else {
        alert(
          error.message || "An unexpected error occurred during registration."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <input
          type="text"
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
          aria-invalid={errors.username ? "true" : "false"}
        />
        {errors.username && (
          <p className="error" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="Email"
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="error" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          placeholder="Password"
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="error" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegistrationForm;
