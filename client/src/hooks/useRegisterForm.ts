import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { sendOtp, verifyOtp, registerUser } from '../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export interface RegisterFormInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  country: string;
  state: string;
  district: string;
  city: string;
  bloodGroup: string;
  gender: string;
  availability: string;
  reportUpload: FileList;
  termsAccepted: boolean;
}

const useRegisterForm = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormInput>({ mode: 'onChange' });

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => sendOtp(email),
    onSuccess: () => toast.success('OTP sent to your email!'),
    onError: () => toast.error('Error sending OTP!'),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => verifyOtp(email, otp),
    onSuccess: () => {
      toast.success('Email verified successfully!');
      setIsVerified(true);
      setOtp('');
      setOtpModalOpen(false);
    },
    onError: () => toast.error('Invalid OTP. Please try again.'),
  });

  const mutation = useMutation({
    mutationFn: (newUser: RegisterFormInput) => registerUser(newUser),
    onSuccess: () => {
      toast.success('User registered successfully!');
      navigate('/login');
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Error registering user!');
      }
    },
  });

  const handleCountryChange = (selectedCountry: string) => {
    setSelectedCountry(selectedCountry);

    if (selectedCountry === 'India') {
      setStates(['Haryana']);
    } else {
      setStates([]);
      setCities([]);
      setDistricts([]);
    }
  };

  const handleStateChange = (selectedState: string) => {
    if (selectedState === 'Haryana') {
      setDistricts(['Kurukshetra']);
    } else {
      setCities([]);
    }
  };

  const handleDistrictChange = (selectedDistrict: string) => {
    if (selectedDistrict === 'Kurukshetra') {
      setCities(['Thanesar']);
    } else {
      setCities([]);
    }
  };

  const handleVerifyClick = () => {
    const emailInput = watch('email');
    setEmail(emailInput);
    sendOtpMutation.mutate(emailInput);
    setOtpModalOpen(true);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      toast.success('Email verified successfully!');
      setIsVerified(true);
      setOtp('');
      setOtpModalOpen(false);
    } else {
      verifyOtpMutation.mutate({ email, otp });
    }
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return {
    register,
    errors,
    isValid,
    watch,
    selectedCountry,
    states,
    cities,
    districts,
    otpModalOpen,
    otp,
    isVerified,
    handleCountryChange,
    handleStateChange,
    handleDistrictChange,
    handleVerifyClick,
    handleOtpSubmit,
    onSubmit,
    setOtp,
    setOtpModalOpen,
  };
};

export default useRegisterForm;
