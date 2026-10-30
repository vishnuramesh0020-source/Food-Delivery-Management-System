import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setFormError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (email, password) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    setFormError('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
          🍔
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to track orders, manage your cart, and reorder favorites
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="mb-6 p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-xs text-orange-900">
        <div className="flex items-center gap-1.5 font-bold mb-1 text-orange-800">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span>Quick Demo Access (1-Click Test)</span>
        </div>
        <p className="text-orange-700/90 mb-2">
          Click below to autofill verified demo credentials:
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemoAccount('sarah@example.com', 'Password123!')}
            className="px-2.5 py-1 bg-white hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 shadow-xs transition"
          >
            Sarah Connor
          </button>
          <button
            type="button"
            onClick={() => fillDemoAccount('alex@example.com', 'Password123!')}
            className="px-2.5 py-1 bg-white hover:bg-orange-100 text-orange-700 font-semibold rounded-lg border border-orange-200 shadow-xs transition"
          >
            Alex Johnson
          </button>
        </div>
      </div>

      {formError && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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

        {/* Password Field with Show/Hide toggle */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
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

        {/* Remember Me & Forgot Password Links */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-orange-600 hover:text-orange-700 transition"
        >
          Create one now
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
