"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, signUpSchema } from "@/lib/schemas";
import { useAuth } from "@/app/(auth)/authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";
import ImagePicker from "@/components/ImagePicker";

const SignUpPage = () => {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { role: "tenant" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: SignUpFormData) => {
    setServerError("");
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        role: data.role,
        profileImage,
      });
      router.push("/");
    } catch (err: any) {
      setServerError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary-50 px-3 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-lg p-5 sm:p-8">
        <Link href="/" className="no-underline">
          <h3 className="text-xl sm:text-2xl font-bold cursor-pointer mb-1">
            HABI<span className="text-secondary-500 font-light">FUL</span>
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          <span className="font-bold">Welcome!</span> Create an account to get started
        </p>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImagePicker
            currentImageUrl={null}
            onImageSelect={(file) => setProfileImage(file)}
            size="md"
          />

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your full name" {...register("name")} className="mt-1 mt-1" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" {...register("email")} className="mt-1 mt-1" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" {...register("password")} className="pr-10 mt-1" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" {...register("confirmPassword")} className="pr-10 mt-1" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" placeholder="Enter your phone number" {...register("phoneNumber")} className="mt-1 mt-1" />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
          </div>

          <div>
            <Label>Role</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setValue("role", value as "tenant" | "manager")}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tenant" id="role-tenant" />
                <Label htmlFor="role-tenant" className="cursor-pointer text-xs sm:text-sm">Tenant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manager" id="role-manager" />
                <Label htmlFor="role-manager" className="cursor-pointer text-xs sm:text-sm">Manager</Label>
              </div>
            </RadioGroup>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary-700 text-white mt-1">
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
