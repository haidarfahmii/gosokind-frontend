"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function VerifyEmailForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <form className="space-y-5">
            {/* Full Name Field */}
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">
                    Full Name
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                        Password
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
            </div>
            {/* Confirm Password Field */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                        Confirm Password
                    </label>
                </div>
                <div className="relative">
                    <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-4"
            >
                <FiLogIn size={20} />
                Verify
            </button>
        </form>
    );
}