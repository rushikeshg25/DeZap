import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      id: string;
      publicKey: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    publicKey: string;
  }
}
