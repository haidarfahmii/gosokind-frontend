"use client";

import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import { useEmployeeLoginForm } from "@/features/auth/hooks/useEmployeeLoginForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function EmployeeLoginForm() {
  const { formik, isLoading, showPassword, togglePasswordVisibility } =
    useEmployeeLoginForm();

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="ml-1">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="employee@gosokind.com"
          autoComplete="email"
          disabled={isLoading}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.touched.email && formik.errors.email
              ? "border-red-500 focus-visible:ring-red-200"
              : ""
          }
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-xs text-red-500 ml-1">{formik.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="ml-1">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            autoComplete="current-password"
            disabled={isLoading}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`pr-12 ${
              formik.touched.password && formik.errors.password
                ? "border-red-500 focus-visible:ring-red-200"
                : ""
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            disabled={isLoading}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="text-xs text-red-500 ml-1">{formik.errors.password}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          "Memproses..."
        ) : (
          <>
            <FiLogIn size={20} className="mr-2" />
            Masuk sebagai Employee
          </>
        )}
      </Button>
    </form>
  );
}
