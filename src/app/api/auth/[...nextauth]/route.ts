import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axiosInstance from "@/utils/axiosInstance";
import { AuthResponse } from "@/@types";
import { AxiosError } from "axios";
import GoogleProvider from "next-auth/providers/google";

const nextAuthHandler = NextAuth({
  providers: [
    // GoogleProvider di sini
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await axiosInstance.post<AuthResponse>(
            "/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: {
                "next-auth-secret-key":
                  process.env.NEXT_AUTH_SECRET_KEY ||
                  "purwadhika-mini-project-evoria-jcwdbsd36",
              },
            }
          );

          console.log("Login Response:", response.data);

          const apiResponse = response.data;

          if (!apiResponse.success || !apiResponse.data) {
            console.error("Invalid response structure");
            return null;
          }

          const { user, token } = apiResponse.data;

          if (user && token) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              accessToken: token,
              avatarUrl: user.avatarUrl,
            };
          }
          return null;
        } catch (error: any) {
          console.error("Login Error:", error.response?.data);

          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage =
            axiosError.response?.data?.message || "Something went wrong";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    // 3. Tambahkan callback signIn untuk handle logika Backend saat login Google
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Kirim data Google ke Backend Anda untuk didaftarkan/login
          const response = await axiosInstance.post("/auth/google-login", {
            email: user.email,
            name: user.name,
            googleId: user.id, // atau sub dari profile
            // avatarUrl: user.image
          });

          const apiResponse = response.data;

          if (apiResponse.success && apiResponse.data) {
            user.accessToken = apiResponse.data.token;
            user.id = apiResponse.data.user.id;
            user.role = apiResponse.data.user.role;
            return true; // Izinkan login
          }
          return false; // Tolak login jika backend gagal
        } catch (error) {
          console.error("Social Login Error:", error);
          return false;
        }
      }
      return true; // Untuk CredentialsProvider, default true
    },
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user?.id;
        token.email = user?.email;
        token.role = user?.role;
        token.name = user?.name;
        // token.avatarUrl = user.avatarUrl! || user.image!;

        if (account?.provider === "google") {
          token.accessToken = user.accessToken;
        } else {
          token.accessToken = user.accessToken;
        }
      }

      if (trigger === "update" && session) {
        if (session.name !== undefined) {
          token.name = session.name;
          console.log("Token name updated:", token.name);
        }

        if (session?.avatarUrl !== undefined) {
          token.avatarUrl = session.avatarUrl;
          console.log("Token avatarUrl updated:", token.avatarUrl);
        }

        if (session.role !== undefined) {
          token.role = session.role;
          console.log("Token role updated:", token.role);
        }

        if (session.accessToken !== undefined) {
          token.accessToken = session.accessToken;
          console.log("Token accessToken updated:", token.accessToken);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.name = token.name;
        session.user.avatarUrl = token.avatarUrl;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { nextAuthHandler as GET, nextAuthHandler as POST };
