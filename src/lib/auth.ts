import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface User extends NextAuthUser {
  id: string;
  username: string;
  avatar: string;
  // picture: string;
  userToken: string;
  auth_type: string;
  role: string | null;
  isAvailable: string | null;
}

interface CustomSession extends Session {
  user: Session["user"] & {
    id: string;
    avatar: string;
    auth_type: string;
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
          auth_type: credentials.auth_type as string,
          role: credentials.role as string,
          isAvailable: credentials.isAvailable as string,
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

      if (account?.provider === "google" && account.id_token && user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login-google`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              picture: user.image,
            }),
          });

          console.log("Response: ", res);
          console.log("Res OK:", res.ok);

          if (!res.ok) {
            console.error("Failed to login via Google to backend");
            return token;
          }

          const result = await res.json();
          console.log("Backend login-google response:", result);
          console.log("Backend result.auth_type:", result.user.auth_type);

          // Inject ke token
          token.id = result.user.id;
          token.username = result.user.username;
          token.email = result.user.email;
          token.image = result.user.avatar;
          token.role = result.user.role;
          token.userToken = result.token; // if backend gives access token
          token.auth_type = result.user.auth_type;
          token.isAvailable = result.user.isAvailable; 
          console.log("token.auth_type: ", token.auth_type);

        } catch (err) {
          console.error("Error calling login-google:", err);
        }
      }

      // Fallback: handle credentials login
      if (user && account?.provider !== "google") {
        token.id = user.id;
        token.name = user.name ?? "";
        token.username = (user as any).username ?? user.name ?? "";
        token.email = user.email ?? "";
        token.image = (user as any).avatar ?? user.image ?? "";
        token.userToken = (user as any).userToken ?? "";
        token.role = (user as any).role ?? null;
        token.auth_type = user.auth_type;
        token.isAvailable = (user as any).isAvailable ?? null;
      }

      return token;
    },

    async session({ token, session }) {
      console.log("Session Callback:", { token, session });

      const isAvailable = token.isAvailable === true || token.isAvailable === "true" || token.isAvailable === "1";


      if (!isAvailable) {
        console.log("User is not available. Clearing session.");

        session.user = {
          id: "",
          name: "",
          email: "",
          image: "",
          role: "",
          auth_type: "",
          emailVerified: null,
        };

        (session as CustomSession).userToken = "";
        // session.expires = new Date(0); // expired now


        return session;
      }

      session.user = {
        ...session.user,
        id: token.id ? String(token.id) : "",
        name: token.name ?? "",
        email: token.email ?? "",
        image: typeof token.image === "string" ? token.image : "",
        role: typeof token.role === "string" ? token.role : "",
        auth_type: typeof token.auth_type === "string" ? token.auth_type : "",
      };

      (session as CustomSession).userToken =
        typeof token.userToken === "string" ? token.userToken : "";

      console.log("Custom Session:", session);
      return session;
    }


  },
});
