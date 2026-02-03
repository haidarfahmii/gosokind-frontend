"use client";

import { FiMail } from "react-icons/fi";

export default function ForgotPasswordForm() {
    return (
        <form className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">
                    Email
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <FiMail size={20} />
                    </div>
                    <input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        required
                    />
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1 leading-relaxed">
                    Kami akan mengirimkan link reset password ke email Anda.
                </p>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all duration-200"
            >
                Submit
            </button>
        </form>
    );
}