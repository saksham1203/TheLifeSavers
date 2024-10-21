import React, { useState, useRef, useEffect } from "react";
import useRegisterForm from "../../hooks/useRegisterForm";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Register: React.FC = () => {
  const {
    register,
    errors,
    isValid,
    watch,
    states,
    cities,
    districts,
    otpModalOpen,
    otp,
    isVerified,
    handleCountryChange,
    handleStateChange,
    handleDistrictChange,
    handleOtpSubmit,
    onSubmit,
    setOtp,
    setOtpModalOpen,
    handleVerifyClick, // API call function to trigger OTP modal
  } = useRegisterForm();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const countries = ["Select Country", "India"];

  const [showPassword, setShowPassword] = useState(false); // Add this state to manage password visibility

  // OTP handling state
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]); // Reference for OTP input fields

  // Handle OTP input change
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp]; // Create a copy of the OTP array
      newOtp[index] = value; // Update the specific index
      setOtp(newOtp.join("")); // Convert the array to a single string and set it
      if (index < otpInputs.current.length - 1) {
        otpInputs.current[index + 1]?.focus(); // Focus on the next input
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp.join("")); // Update and set the concatenated OTP string
    }
  };

  // Handle OTP input navigation using backspace
  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Focus on the first OTP input field when moving to the OTP step
  useEffect(() => {
    if (otpModalOpen && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [otpModalOpen]);

  return (
    <div className="flex items-center justify-center min-h-screen py-20 animate-fade-in">
      <Toaster />
      <div className="flex w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden animate-slide-in">
        <div
          className="w-1/2 bg-cover bg-center hidden sm:block"
          style={{
            backgroundImage:
              "url('https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA1L3JtNjU1LWVsZW1lbnRncm91cC10ZS0wMDRhLnBuZw.png')",
          }}
        ></div>
        <div className="w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Be a{" "}
            <span className="text-3xl text-red-600 font-bold">Life Saver:</span>{" "}
            Donate Blood, Save Lives!
          </h2>
          <div className="flex items-center mb-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-sm text-gray-600">Register here</span>
            <hr className="flex-1 border-gray-300" />
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                    maxLength: {
                      value: 50,
                      message: "First name cannot exceed 50 characters",
                    },
                  })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                    maxLength: {
                      value: 50,
                      message: "Last name cannot exceed 50 characters",
                    },
                  })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative mt-1">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`block w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.email}
                  />
                  {!errors.email && watch("email") && (
                    <button
                      type="button"
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 ${
                        isVerified ? "bg-green-600" : "bg-red-600"
                      } text-white rounded-md hover:bg-red-700`}
                      onClick={() => {
                        handleVerifyClick();
                        setOtpModalOpen(true); // Open OTP modal after API call
                      }}
                      disabled={isVerified}
                    >
                      {isVerified ? "Verified" : "Verify"}
                    </button>
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
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
                    className={`mt-1 block w-full px-3 py-2 pr-10 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.password}
                    style={{ paddingRight: "2.5rem" }} // Ensures space for the icon
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)} // Toggle password visibility
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible className="text-gray-500" />
                    ) : (
                      <AiFillEye className="text-gray-500" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    id="mobileNumber"
                    placeholder="Please Enter Your Mobile Number"
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Mobile number must be 10 digits",
                      },
                    })}
                    className={`flex-1 block w-full px-3 py-2 border ${
                      errors.mobileNumber ? "border-red-500" : "border-gray-300"
                    } rounded-r-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.mobileNumber}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-gray-700"
                >
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  {...register("bloodGroup", {
                    required: "Blood group is required",
                  })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.bloodGroup ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.bloodGroup}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group, index) => (
                    <option key={index} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender", { required: "Gender is required" })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.gender}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div>
                <label
                  htmlFor="availability"
                  className="block text-sm font-medium text-gray-700"
                >
                  Availability
                </label>
                <select
                  id="availability"
                  {...register("availability", {
                    required: "Availability is required",
                  })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.availability ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  defaultValue="available"
                  aria-invalid={!!errors.availability}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availability.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  id="country"
                  {...register("country", { required: "Country is required" })}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.country}
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <select
                  id="state"
                  {...register("state", { required: "State is required" })}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.state}
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700"
                >
                  District
                </label>
                <select
                  id="district"
                  {...register("district", {
                    required: "District is required",
                  })}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.district ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.district}
                >
                  <option value="">Select District</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <select
                  id="city"
                  {...register("city", { required: "City is required" })}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                  aria-invalid={!!errors.city}
                >
                  <option value="">Select City</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="termsAccepted"
                  type="checkbox"
                  {...register("termsAccepted", { required: true })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  aria-invalid={!!errors.termsAccepted}
                />
                <label
                  htmlFor="termsAccepted"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <a href="#" className="text-red-600">
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isValid || !isVerified}
                className={`w-full mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  (!isValid || !isVerified) && "opacity-50 cursor-not-allowed"
                } transition-transform duration-300 transform hover:scale-105`}
              >
                Register
              </button>
            </div>

            {/* Login Link */}
            <div className="flex items-center mt-4">
              <hr className="flex-1 border-gray-300" />
              <span className="mx-4 text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-500 font-medium"
                >
                  Login here
                </Link>
              </span>
              <hr className="flex-1 border-gray-300" />
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">Enter OTP</h3>
            <form onSubmit={handleOtpSubmit} className="mt-4 space-y-4">
              {/* OTP Input UI */}
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="tel" // Opens number keyboard on mobile
                    inputMode="numeric" // Ensures numeric layout for all devices
                    maxLength={1}
                    className="w-12 h-12 border text-center text-2xl rounded-md border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500"
                    value={otp[index] || ""} // Ensure OTP value state handling
                    onChange={(e) => handleOtpChange(e, index)} // Handle OTP input change
                    onKeyDown={(e) => handleOtpKeyDown(e, index)} // Handle backspace and navigation
                    ref={(el) => (otpInputs.current[index] = el)} // Ensure OTP inputs focus handling
                  />
                ))}
              </div>

              {/* Buttons for submitting or canceling */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400"
                  onClick={() => setOtpModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                  disabled={isVerified}
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
