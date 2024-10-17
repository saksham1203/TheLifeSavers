import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSendOtpMutation, useResetPasswordMutation } from "../../hooks/useForgotPassword";
import { FaSpinner } from "react-icons/fa"; // Spinner for loading feedback

interface IForgotPasswordForm {
  email: string;
}

interface IResetPasswordForm {
  email: string;
  otp: string[];
  newPassword: string;
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<number>(1); // Step 1: Enter Email, Step 2: Enter OTP and New Password
  const [email, setEmail] = useState<string>(""); // Store email for step 2
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for API requests
  const navigate = useNavigate();
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]); // Reference for OTP input fields

  // React Hook Form setup for email form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IForgotPasswordForm>({ mode: "onChange" });

  // React Hook Form setup for reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset, isValid: isValidReset },
    setValue: setValueReset,
  } = useForm<IResetPasswordForm>({ mode: "onChange" });

  // Hook for OTP mutation
  const sendOtpMutation = useSendOtpMutation();

  // Hook for resetting password
  const resetPasswordMutation = useResetPasswordMutation();

  // Handle form submission to send OTP
  const onSubmitEmail: SubmitHandler<IForgotPasswordForm> = (data) => {
    setIsLoading(true);
    sendOtpMutation.mutate(data.email, {
      onSuccess: () => {
        toast.success("OTP sent to your email!");
        setEmail(data.email); // Save the email for step 2
        setStep(2); // Move to next step
        setIsLoading(false);
      },
      onError: (error) => {
        toast.error(error?.message || "Error sending OTP, please try again.");
        setIsLoading(false);
      },
    });
  };

  // Handle form submission to reset password
  const onSubmitReset: SubmitHandler<IResetPasswordForm> = (data) => {
    setIsLoading(true);
    resetPasswordMutation.mutate(
      {
        email: data.email,
        otp: data.otp.join(""), // Convert OTP array to string
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          navigate("/login");
          setIsLoading(false);
        },
        onError: (error) => {
          toast.error(error?.message || "Error resetting password, please try again.");
          setIsLoading(false);
        },
      }
    );
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      setValueReset(`otp.${index}`, value);
      if (index < otpInputs.current.length - 1) {
        otpInputs.current[index + 1]?.focus();
      }
    } else {
      setValueReset(`otp.${index}`, "");
    }
  };

  // Handle OTP input navigation using backspace
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value) {
      if (index > 0) {
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  // Focus on the first OTP input field when moving to step 2
  useEffect(() => {
    if (step === 2 && otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, [step]);

  return (
    <div className="flex items-center justify-center min-h-screen py-20">
      <Toaster />
      <div className="flex w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full p-8 flex flex-col justify-center">
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Forgot Password
              </h2>
              <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
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
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                    aria-invalid={!!errors.email}
                    aria-describedby="emailError"
                  />
                  {errors.email && (
                    <p id="emailError" className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      isValid && !isLoading ? "bg-red-600 hover:bg-red-700" : "bg-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-300 transform ${
                      isValid ? "hover:scale-105" : ""
                    }`}
                  >
                    {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Send OTP"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                Reset Password
              </h2>
              <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
                <div className="flex justify-center space-x-2 mb-4">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      {...registerReset(`otp.${index}`, { required: true })}
                      className={`w-12 h-12 border text-center text-2xl rounded-md ${
                        errorsReset.otp ? "border-red-500" : "border-gray-300"
                      } focus:outline-none focus:ring-red-500 focus:border-red-500`}
                      ref={(el) => (otpInputs.current[index] = el)}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      placeholder="Enter your new password"
                      {...registerReset("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long",
                        },
                      })}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errorsReset.newPassword ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                      aria-invalid={!!errorsReset.newPassword}
                      aria-describedby="passwordError"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <AiFillEyeInvisible className="text-gray-500" />
                      ) : (
                        <AiFillEye className="text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errorsReset.newPassword && (
                    <p id="passwordError" className="text-red-500 text-sm mt-1">
                      {errorsReset.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <input type="hidden" value={email} {...registerReset("email")} />
                  <button
                    type="submit"
                    disabled={!isValidReset || isLoading}
                    className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                      isValidReset && !isLoading
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform duration-300 transform ${
                      isValidReset ? "hover:scale-105" : ""
                    }`}
                  >
                    {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex items-center mt-4">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-4 text-sm text-gray-600">
              <Link to="/login" className="text-red-600 hover:text-red-500 font-medium">
                Back to Login
              </Link>
            </span>
            <hr className="flex-1 border-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
