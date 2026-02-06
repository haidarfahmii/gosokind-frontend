"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";

interface UseVerifyTokenProps {
    token: string;
    redirectOnInvalid?: string; // Url redirect jika token salah (opsional)
}

export const useVerifyToken = ({ token, redirectOnInvalid }: UseVerifyTokenProps) => {
    const [isVerifyingToken, setIsVerifyingToken] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const validateToken = async () => {
            // Cegah request jika token kosong (atau biarkan backend handle)
            if (!token) {
                setIsVerifyingToken(false);
                return;
            }

            try {
                // Panggil endpoint verify-token yang sudah ada
                await authService.checkVerifyToken(token);

                setIsTokenValid(true);
            } catch (error) {
                console.error("Token verification failed:", error);
                setIsTokenValid(false);

                toast.error("Token tidak valid atau sudah kadaluarsa.");

                if (redirectOnInvalid) {
                    router.replace(redirectOnInvalid);
                }
            } finally {
                setIsVerifyingToken(false);
            }
        };

        validateToken();
    }, [token, router, redirectOnInvalid]);

    return {
        isVerifyingToken,
        isTokenValid,
    };
};