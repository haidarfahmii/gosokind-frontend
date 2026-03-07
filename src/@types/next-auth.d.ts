import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    avatarUrl?: string | null;
    provider: string;
  }

  interface Session {
    user: {
      id: string;
      role: string; // Tambahkan ini agar bisa diakses di client via useSession()
      accessToken: string;
      name: string;
      avatarUrl?: string | null;
      provider: string
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string; // Tambahkan ini
    email: string;
    accessToken: string;
    name: string;
    avatarUrl?: string | null;
    provider: string
  }
}
