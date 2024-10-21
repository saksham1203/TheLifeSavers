import React, { ReactNode, useState, FormEvent } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
// import { useDonorsQuery, useVerifyPasswordMutation } from "../hooks/useDashboardHooks";
import {
  useDonorsQuery,
  useVerifyPasswordMutation,
} from "../../hooks/useDashboardHooks";

export interface FindDonor {
  bloodGroup: string;
  country: string;
  state: string;
  district: string;
  city: string;
}

export interface Donor {
  firstName: ReactNode;
  lastName: ReactNode;
  name: string;
  availability: boolean;
  mobile: string;
  reportUrl: string;
  mobileNumber?: string;
}

export interface VerifyPasswordResponse {
  isValid: boolean;
  msg?: string;
}

const Dashboard: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FindDonor>({ mode: "onChange" });

  const [, setSelectedCountry] = useState<string>("");
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [bloodGroups] = useState<string[]>([
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [password, setPassword] = useState<string>("");
  const [showFullNumber, setShowFullNumber] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const countries = ["Select Country", "India"];

  const handleCountryChange = (selectedCountry: string) => {
    setSelectedCountry(selectedCountry);

    if (selectedCountry === "India") {
      setStates(["Haryana"]);
    } else {
      setStates([]);
      setCities([]);
      setDistricts([]);
    }
  };

  const handleStateChange = (selectedState: string) => {
    if (selectedState === "Haryana") {
      setDistricts(["Kurukshetra"]);
    } else {
      setDistricts([]);
      setCities([]);
    }
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    if (selectedDistrict === "Kurukshetra") {
      setCities(["Thanesar"]);
    } else {
      setCities([]);
    }
  };

  const { data: donors, isLoading, isError, refetch } = useDonorsQuery(watch);

  const onSubmit: SubmitHandler<FindDonor> = (data) => {
    console.log(data);
    setShowResult(true);
    refetch();
  };

  const handleMobileClick = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowPopup(true);
    setShowFullNumber(false);
    setPopupMessage(""); // Clear any previous message
  };

  const mutation = useVerifyPasswordMutation();

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(password, {
      onSuccess: (data) => {
        if (data.isValid) {
          setShowFullNumber(true);
          setPopupMessage(""); // Clear the error message
        } else {
          setPopupMessage(data.msg || "Password is incorrect");
        }
      },
      onError: (error: any) => {
        if (error.response && error.response.data && error.response.data.msg) {
          setPopupMessage(error.response.data.msg);
        } else {
          setPopupMessage("An error occurred while verifying the password");
        }
      },
    });
    setPassword("");
  };

  const maskedMobile = (mobile?: string) => {
    if (!mobile) return ""; // Handle case where mobile is undefined or null

    return `${mobile.slice(0, 2)}xxxxxx${mobile.slice(-2)}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-10 pb-10">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mt-8 mb-8 animate-fade-in">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center ">
            Find Blood Donor
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full bg-red-500 text-white py-2 px-4 mt-4 rounded-md ${
                  !isValid
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                }`}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* show result on pc */}
      {showResult && (
        <div className="hidden sm:block w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mt-4 mb-8 animate-fade-in">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center ">
              Donors List
            </h2>

            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center h-34">
                <div className="inline-block text-center">
                  <div
                    className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-red-500 border-r-transparent align-[-0.125em] text-danger motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 mt-4">Loading...</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {!isLoading && isError && (
              <div className="flex flex-col items-center justify-center h-34">
                <p className="text-red-500 text-lg mb-4">
                  No users found with the specified details.
                </p>
                <svg
                  onClick={() => {
                    refetch();
                  }}
                  className="w-10 h-10 text-red-600 cursor-pointer hover:text-red-500 transition-colors duration-300 transform"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* Donor list */}
            {!isLoading && donors && donors.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 animate-slide-in">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donors.map((donor: Donor, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {`${donor.firstName} ${donor.lastName}`}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm mt-1 ${
                            donor.availability
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {donor.availability ? "Available" : "Unavailable"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleMobileClick(donor)}
                            className="text-blue-500 hover:underline"
                          >
                            {maskedMobile(donor.mobileNumber)}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <a
                            href={donor.reportUrl}
                            download
                            className="text-red-500 hover:underline"
                          >
                            Download Report
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* show result on mobile */}
      {showResult && (
        <div className="block sm:hidden w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden mt-4 animate-fade-in">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Donors List
            </h2>
            <div className="space-y-4">
              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-center items-center h-16">
                  <div className="inline-block text-center">
                    <div
                      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-500 border-r-transparent align-[-0.125em] text-danger motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 mt-2">Loading...</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {!isLoading && isError && (
                <div className="flex justify-center items-center h-16">
                  <p className="text-red-500 text-lg">
                    No users found with the specified details.
                  </p>
                </div>
              )}

              {/* Donor list */}
              {!isLoading &&
                donors &&
                donors.length > 0 &&
                donors.map((donor: Donor, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 flex items-center justify-between animate-slide-in"
                  >
                    <div className="flex items-center">
                      <span className="text-xs font-bold text-gray-600 mr-2">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {`${donor.firstName} ${donor.lastName}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {donor.availability ? (
                            <span className="text-green-600">Available</span>
                          ) : (
                            <span className="text-red-600">Not Available</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleMobileClick(donor)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Mobile
                    </button>
                  </div>
                ))}

              {/* Fallback if no donors */}
              {!isLoading && donors && donors.length === 0 && (
                <p className="text-lg text-gray-600">No donors found.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="fixed z-10 inset-0 overflow-y-auto animate-fade-in">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full max-w-2xl animate-slide-in">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-green-100 sm:mx-0 sm:h-12 sm:w-12">
                    <svg
                      className="h-8 w-8 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-xl leading-6 font-medium text-gray-900">
                      Mobile Number
                    </h3>
                    <div className="mt-3">
                      <p className="text-lg font-bold text-blue-500">
                        {selectedDonor && showFullNumber ? (
                          <a
                            href={`tel:${selectedDonor.mobileNumber}`}
                            className="hover:underline"
                          >
                            {selectedDonor.mobileNumber}
                          </a>
                        ) : (
                          maskedMobile(selectedDonor?.mobileNumber || "")
                        )}
                      </p>
                      {!showFullNumber && (
                        <form onSubmit={handlePasswordSubmit}>
                          <input
                            type="password"
                            placeholder="Enter password to reveal"
                            className="mt-3 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </form>
                      )}
                      {popupMessage && (
                        <p className="mt-2 text-sm text-red-500">
                          {popupMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                {!showFullNumber && (
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-300 transform hover:scale-105"
                    onClick={handlePasswordSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
