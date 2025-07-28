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
    maxAge: 60 * Number(process.env.USER_TOKEN_AGE || 60), // fallback ke 60 menit jika env tidak ada
    // maxAge: 60 * 60, // fallback ke 60 menit jika env tidak ada

  },

  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { token, user, account });

    if(account){
      console.log("JWT account Provider: ", account.provider);
    }

    if (user) {
      token.id = user.id;
      token.name = user.name ?? "";
      token.username = (user as any).username ?? user.name ?? "";
      token.email = user.email ?? "";
      token.image = (user as any).avatar ?? user.image ?? "";
      token.userToken = (user as any).userToken ?? "";
      token.role = (user as any).role ?? null;
    }

      return token;
    },

    async session({ token, session }) {
      console.log("Session Callback:", { token, session });

  session.user = {
    ...session.user,
    id: token.id ? String(token.id) : "",
    name: token.name ?? "",
    email: token.email ?? "",
    image: typeof token.image === "string" ? token.image : "", // ✅ fix disini
    role: typeof token.role === "string" ? token.role : "", // ✅ fix disini

  };

  (session as CustomSession).userToken =
  typeof token.userToken === "string" ? token.userToken : "";



      console.log("Custom Session:", session);

      return session;
    },
  },
});
