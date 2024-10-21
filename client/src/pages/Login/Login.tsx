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
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const { isFormSubmitted, setIsFormSubmitted, mutate } = useAuthLogic(
    setAuthenticated,
    login,
    toast
  );

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setIsFormSubmitted(true);
    setIsLoading(true);
    let identifier = data.identifier.trim();
    if (/^\d{10}$/.test(identifier)) {
      identifier = `+91${identifier}`;
    }
    const updatedData = { ...data, identifier };
    await mutate(updatedData);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 mx-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Welcome back,{" "}
          <span className="text-red-600">Life Saver</span>
        </h2>
        <div className="mb-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-600">
            Use email or mobile to login
          </span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Email or Mobile Number
            </label>
            <input
              type="text"
              id="identifier"
              placeholder="Enter your email or mobile number"
              {...register("identifier", {
                required: "This field is required",
              })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.identifier ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500`}
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-red-500 focus:border-red-500`}
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input type="checkbox" id="rememberMe" {...register("rememberMe")} />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-sm text-red-600">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={!isValid || isFormSubmitted}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            {isLoading ? "Loading..." : "Log in"}
          </button>
        </form>
        <div className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/" className="text-red-600">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
