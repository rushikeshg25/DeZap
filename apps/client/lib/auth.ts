import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SigninMessage } from "./SigninMessage";
import prisma from "@repo/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      authorize: async (credentials, req) => {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse((credentials?.message as string) || "{}")
          );
          const validationResult = await signinMessage.validate(
            (credentials?.signature as string) || ""
          );

          if (!validationResult)
            throw new Error("Could not validate the signed message");
          const data = await prisma.user.upsert({
            where: {
              publicKey: signinMessage.publicKey,
            },
            create: {
              publicKey: signinMessage.publicKey,
            },
            update: {},
          });
          return {
            id: data.id,
            publicKey: data.publicKey,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.publicKey = token.publicKey;
        session.user.id = token.id;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return {
          ...token,
          ...session.user,
        };
      }

      if (user) {
        token.id = user.id!;
        //@ts-ignore
        token.publicKey = user.publicKey;
      }
      return token;
    },
  },
});
