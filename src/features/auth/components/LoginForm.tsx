"use client";

import Link from "next/link";
import { FiEye, FiEyeOff, FiLogIn, FiUser, FiBriefcase } from "react-icons/fi";
import { useLoginForm } from "../hooks/useLoginForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LoginForm() {
  const {
    formik,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    loginType,
    toggleLoginType,
  } = useLoginForm();

  return (
    <div className="space-y-5">
      {/* Role Toggle */}
      <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => loginType !== "customer" && toggleLoginType()}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
            loginType === "customer"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiUser size={18} />
          Customer
        </button>
        <button
          type="button"
          onClick={() => loginType !== "employee" && toggleLoginType()}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-sm transition-all ${
            loginType === "employee"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FiBriefcase size={18} />
          Employee
        </button>
      </div>

      {/* Info Badge */}
      <div
        className={`text-xs text-center p-2 rounded-md ${
          loginType === "customer"
            ? "bg-blue-50 text-blue-700"
            : "bg-purple-50 text-purple-700"
        }`}
      >
        {loginType === "customer"
          ? "🛍️ Login as Customer to place laundry orders"
          : "🏢 Login as Employee to access admin dashboard"}
      </div>

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
            placeholder={
              loginType === "customer"
                ? "customer@example.com"
                : "employee@gosokind.com"
            }
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
            <div className="text-xs text-red-500 ml-1 mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <Label htmlFor="password">Password</Label>
            {loginType === "customer" && (
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot Password?
              </Link>
            )}
          </div>
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
            <div className="text-xs text-red-500 ml-1 mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              <FiLogIn size={20} className="mr-2" />
              Login as {loginType === "customer" ? "Customer" : "Employee"}
            </>
          )}
        </Button>
      </form>

      {/* Additional Info for Employee Login */}
      {loginType === "employee" && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">⚠️ Employee Access Only:</span> This
            login is for Gosokind staff members only. If you're a customer,
            please switch to Customer login above.
          </p>
        </div>
      )}
    </div>
  );
}
