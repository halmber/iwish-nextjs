import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validateCredentials = z
          .object({
            email: z.string(),
            password: z.string(),
          })
          .parse(credentials);

        const user = await prisma.user.findUnique({
          where: {
            email: validateCredentials.email,
          },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await compare(
          validateCredentials.password,
          user.password,
        );

        if (passwordsMatch) return user;

        console.log("Invalid credentials");
        return null;
      },
    }),
    GitHub,
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      if (trigger === "update" && session?.name && session?.email) {
        token.name = session.name;
        token.email = session.email;
      }
      if (trigger === "update" && session?.image) {
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return "/";
    },
  },
});
