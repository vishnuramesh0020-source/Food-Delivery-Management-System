import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../common/Input';
import Button from '../common/Button';

const ForgotPasswordForm = () => {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Multi-step: 1 = Enter Email, 2 = Enter Verification Code, 3 = Reset Password, 4 = Success
  const [step, setStep] = useState(1);
  const [emailAddress, setEmailAddress] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Step 1 Form (Email)
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({ defaultValues: { email: '' } });

  // Step 2 Form (OTP Code)
  const [otpCode, setOtpCode] = useState(['4', '8', '2', '1']);

  // Step 3 Form (New Password)
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm({ defaultValues: { newPassword: '', confirmNewPassword: '' } });

  const newPasswordValue = watchPassword('newPassword');

  // Submit Step 1
  const onEmailSubmit = (data) => {
    setApiError('');
    setEmailAddress(data.email);
    setStep(2);
  };

  // Submit Step 2
  const onOtpVerify = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // Submit Step 3
  const onResetSubmit = async (data) => {
    setApiError('');
    setIsSubmitting(true);
    try {
      await forgotPassword(emailAddress, data.newPassword);
      setStep(4);
    } catch (err) {
      setApiError(err.message || 'Failed to reset password. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
      {/* Back button */}
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Login
      </Link>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 rounded-full ${
                  step > s ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {apiError && (
        <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
          {apiError}
        </div>
      )}

      {/* STEP 1: ENTER EMAIL */}
      {step === 1 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email address and we&apos;ll send you a password reset code.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              placeholder="e.g. sarah@example.com"
              icon={Mail}
              error={emailErrors.email}
              {...registerEmail('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
            />

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Send Verification Code
            </Button>
          </form>
        </div>
      )}

      {/* STEP 2: VERIFICATION OTP CODE */}
      {step === 2 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Check Your Inbox
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              We sent a 4-digit verification code to{' '}
              <span className="font-semibold text-slate-700">{emailAddress}</span>
            </p>
          </div>

          <form onSubmit={onOtpVerify} className="space-y-5">
            <div className="flex justify-center gap-3 my-4">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...otpCode];
                    next[i] = e.target.value;
                    setOtpCode(next);
                  }}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                />
              ))}
            </div>

            <p className="text-center text-xs text-slate-400">
              Demo code has been auto-filled for quick testing.
            </p>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Verify Code & Continue
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition"
              >
                Change email address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <div>
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Password
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose a strong password with at least 6 characters.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit(onResetSubmit)} className="space-y-4">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              rightIcon={showNewPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowNewPassword(!showNewPassword)}
              error={passwordErrors.newPassword}
              {...registerPassword('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              rightIcon={showConfirmPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              error={passwordErrors.confirmNewPassword}
              {...registerPassword('confirmNewPassword', {
                required: 'Please confirm your new password',
                validate: (value) =>
                  value === newPasswordValue || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              Reset & Save Password
            </Button>
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS CONFIRMATION */}
      {step === 4 && (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Password Reset Complete!
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Your account password has been updated securely. You can now log in with your new credentials.
          </p>
          <Button
            onClick={() => navigate('/login')}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
