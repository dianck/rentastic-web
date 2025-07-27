import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface User extends NextAuthUser {
  id: string;
  username: string;
  avatar: string;
  // picture: string;
  userToken: string;
  role: string | null;
}

interface CustomSession extends Session {
  user: Session["user"] & {
    id: string;
    avatar: string;
    role: string | null;
  };
  userToken: string;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        console.log("Authorize credentials:", credentials);

        if (!credentials) return null;
        console.log("Credentials OK");

        const user: User = {
          id: credentials.id as string,
          name: credentials.username as string,
          username: credentials.username as string,
          email: credentials.email as string,
          avatar: credentials.avatar as string,
          // avatar: "Avatar-123",
          // picture: credentials.picture as string,
          userToken: credentials.userToken as string,
          role: credentials.role as string,
        };
        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 1, // 1 hour
  },

  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { token, user, account });

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = (user as any).username ?? user.name ?? "";
        token.email = user.email ?? "";
        token.image = (user as any).avatar ?? token.picture ?? "";
        // token.avatar = token.picture;
        token.userToken = (user as any).userToken ??  token.jti ?? "";
        token.role = (user as any).role ?? null;
      }

      return token;
    },

    async session({ token, session }) {
      console.log("Session Callback:", { token, session });

      session.user = {
        ...session.user,
        name: typeof token.name === "string" ? token.name : "",
        id: `${token.id ?? ""}`,
        email: token.email as string,
        image: token.image as string,
        // avatar: "avatar123",
        // picture: token.picture as string,
        role: token.role as string | null,
      };

      const customSession = session as CustomSession;
      customSession.userToken = token.userToken as string;

      console.log("Custom Session:", customSession);

      return customSession;
    },
  },
});
