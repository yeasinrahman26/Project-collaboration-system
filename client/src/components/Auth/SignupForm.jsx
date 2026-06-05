"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/Common/Button";
import { Input } from "@/components/Common/Input";
import toast from "react-hot-toast";
import { User, Mail, Lock, CheckCircle } from "lucide-react";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await signup(data.name, data.email, data.password);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        icon={User}
        {...register("name", {
          required: "Full name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        })}
        error={errors.name?.message}
      />

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        icon={Mail}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        })}
        error={errors.email?.message}
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="Create a password"
        icon={Lock}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={errors.password?.message}
        helper="At least 6 characters"
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        icon={CheckCircle}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        })}
        error={errors.confirmPassword?.message}
      />

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          required
          className="mt-1 w-4 h-4 rounded border-gray-300 accent-primary"
        />
        <span className="text-gray-600 dark:text-gray-400">
          I agree to the{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Sign Up Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full"
      >
        Create Account
      </Button>

      {/* Login Link */}
      <p className="text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
