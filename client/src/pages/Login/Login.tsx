import React, { useState, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../Context/AuthContext";
import useAuthLogic from "../../hooks/useAuthLogic";

interface LoginFormInput {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const { setAuthenticated, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInput>({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for button feedback

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Using custom hook for authentication logic
  const { isFormSubmitted, setIsFormSubmitted, mutate } = useAuthLogic(setAuthenticated, login, toast);

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setIsFormSubmitted(true);
    setIsLoading(true); // Set loading state
    let identifier = data.identifier.trim();
    if (/^\d{10}$/.test(identifier)) {
      identifier = `+91${identifier}`;
    }
    const updatedData = { ...data, identifier };
    await mutate(updatedData);
    setIsLoading(false); // Reset loading state after submission
  };

  return (
    <div className="flex items-center justify-center min-h-screen animate-fade-in">
      <Toaster />
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden flex flex-col sm:flex-row shadow-lg animate-slide-in">
        <div
          className="hidden sm:block sm:w-1/2 bg-cover bg-center lazyload"
          style={{
            backgroundImage: "url('https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA1L3JtNjU1LWVsZW1lbnRncm91cC10ZS0wMDRhLnBuZw.png')",
          }}
          aria-label="Welcome background image"
        ></div>
        <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome back,{" "}
            <span className="text-3xl text-red-600 font-bold">Life Saver</span>
          </h2>
          <div className="flex items-center mb-2 w-full">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-sm text-gray-600">
              Use email or mobile number to login
            </span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full" aria-live="polite">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700"
                aria-label="Email or Mobile Number"
              >
                Email or Mobile Number
              </label>
              <input
                type="text"
                id="identifier"
                placeholder="Enter your email or mobile number"
                {...register("identifier", {
                  required: "Email or mobile number is required",
                  validate: {
                    isValidMobileNumber: (value) => {
                      const cleanedValue = value.replace(/\D/g, "");
                      const hasCountryCode = value.startsWith("+91");
                      if (hasCountryCode && value.length > 13) {
                        return "Please enter valid mobile number";
                      }
                      if (!hasCountryCode && cleanedValue.length > 10) {
                        return "Mobile number cannot be more than 10 digits";
                      }
                      return true;
                    },
                  },
                })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.identifier ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                aria-invalid={errors.identifier ? "true" : "false"}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.identifier.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
                aria-label="Password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <div
                className="absolute inset-y-11 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <AiFillEyeInvisible className="text-gray-500" />
                ) : (
                  <AiFillEye className="text-gray-500" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  aria-label="Remember me"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={!isValid || isFormSubmitted}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-transform duration-300 transform hover:scale-105"
                aria-disabled={!isValid || isFormSubmitted}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/" className="font-medium text-red-600 hover:text-red-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
