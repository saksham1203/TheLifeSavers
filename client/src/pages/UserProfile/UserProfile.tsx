import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useUserProfileForm } from "../../hooks/useUserProfileForm";
import { Toaster } from "react-hot-toast";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { user } = useAuth();
  const { register, handleSubmit, errors, onSubmit, watch } = useUserProfileForm(user);

  // Location state management
  const [, setSelectedCountry] = useState<string>(user?.country || "");
  const [selectedState, setSelectedState] = useState<string>(user?.state || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(user?.district || "");
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const countries: string[] = ["Select Country", "India"];
  const bloodGroups: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const genders: string[] = ["Male", "Female", "Other"];

  // Memoized handlers for performance optimization
  const handleCountryChange = useCallback((selectedCountry: string) => {
    setSelectedCountry(selectedCountry);
    if (selectedCountry === "India") {
      setStates(["Haryana"]);
    } else {
      setStates([]);
      setDistricts([]);
      setCities([]);
      setSelectedState("");
      setSelectedDistrict("");
    }
  }, []);

  const handleStateChange = useCallback((selectedState: string) => {
    setSelectedState(selectedState);
    if (selectedState === "Haryana") {
      setDistricts(["Kurukshetra"]);
    } else {
      setDistricts([]);
      setCities([]);
      setSelectedDistrict("");
    }
  }, []);

  const handleDistrictChange = useCallback((selectedDistrict: string) => {
    setSelectedDistrict(selectedDistrict);
    if (selectedDistrict === "Kurukshetra") {
      setCities(["Thanesar"]);
    } else {
      setCities([]);
    }
  }, []);

  // Update the location state when the form values change
  useEffect(() => {
    handleCountryChange(watch("country"));
  }, [watch("country"), handleCountryChange]);

  useEffect(() => {
    handleStateChange(watch("state"));
  }, [watch("state"), handleStateChange]);

  useEffect(() => {
    handleDistrictChange(watch("district"));
  }, [watch("district"), handleDistrictChange]);

  const avatarText = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  return (
    <div className="flex flex-col items-center min-h-screen pt-10 pb-10 animate-fade-in">
      <Toaster position="top-center" />
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mt-16 mb-16 animate-slide-in">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="w-full md:w-1/3 bg-gray-200 p-8 flex flex-col items-center justify-center">
            <div className="bg-red-500 rounded-full w-32 h-32 flex items-center justify-center mb-4 text-white text-2xl font-semibold">
              {avatarText}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}{" "}
              <span className="text-gray-500">(Edit)</span>
            </h2>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    {...register("firstName", {
                      required: "First name is required",
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
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    {...register("lastName", {
                      required: "Last name is required",
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    readOnly
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
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
                      {...register("mobileNumber", {
                        required: "Mobile number is required",
                      })}
                      className={`flex-1 block w-full px-3 py-2 border-2 border-gray-300 rounded-r-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm ${
                        errors.mobileNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Country, State, District, City Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.country}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
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
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>
                  <select
                    id="state"
                    {...register("state", {
                      required: "State is required",
                    })}
                    onChange={(e) => handleStateChange(e.target.value)}
                    value={selectedState}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.state}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={selectedDistrict}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.district}
                  >
                    <option value="">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
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
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <select
                    id="city"
                    {...register("city", {
                      required: "City is required",
                    })}
                    value={watch("city")}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.city}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
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

              {/* Blood Group & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
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
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.gender}
                  >
                    <option value="">Select Gender</option>
                    {genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-300 transform hover:scale-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
