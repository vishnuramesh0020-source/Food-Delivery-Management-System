import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      password: '',
      confirmPassword: '',
      agreeTerms: true,
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        city: data.city,
        password: data.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
          ✨
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Join BiteRush today to unlock discounts & speedy doorstep deliveries
        </p>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Jessica Alba"
          icon={User}
          error={errors.name}
          {...register('name', {
            required: 'Full name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          })}
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          icon={Mail}
          error={errors.email}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
        />

        {/* Phone Number */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 019-2834"
          icon={Phone}
          error={errors.phone}
          {...register('phone', {
            required: 'Phone number is required for delivery contact',
            minLength: {
              value: 7,
              message: 'Phone number must have at least 7 digits',
            },
          })}
        />

        {/* Street & City in 2 columns */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Street Address"
            type="text"
            placeholder="123 Food Street"
            icon={MapPin}
            error={errors.street}
            {...register('street', {
              required: 'Street is required',
            })}
          />
          <Input
            label="City"
            type="text"
            placeholder="New York"
            error={errors.city}
            {...register('city', {
              required: 'City is required',
            })}
          />
        </div>

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 6 characters"
          icon={Lock}
          rightIcon={showPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowPassword(!showPassword)}
          error={errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Re-enter your password"
          icon={Lock}
          rightIcon={showConfirmPassword ? EyeOff : Eye}
          onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          error={errors.confirmPassword}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === passwordValue || 'Passwords do not match',
          })}
        />

        {/* Terms agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
              {...register('agreeTerms', {
                required: 'You must agree to the Terms of Service to continue',
              })}
            />
            <span>
              I agree to the{' '}
              <span className="text-orange-600 underline font-medium">Terms of Service</span>{' '}
              and{' '}
              <span className="text-orange-600 underline font-medium">Privacy Policy</span>.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-xs text-rose-500 font-medium">
              {errors.agreeTerms.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-3"
          isLoading={isSubmitting}
        >
          Create Free Account
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-orange-600 hover:text-orange-700 transition"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
