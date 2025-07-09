import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";

interface User extends NextAuthUser {
  id: string;
  username: string;
  avatar: string;
  userToken: string;
  role: string | null;
}

// interface DecodedToken {
//   id: string | number;
//   role: string | null;
//   referralCode: string | null;
// }

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

        // Delay sebentar (misalnya 3 detik) supaya kamu bisa lihat log dulu
        // await new Promise((resolve) => setTimeout(resolve, 13000));

        if (!credentials) return null;


        const user: User = {
          id: credentials.id as string,
          name: credentials.username as string,
          username: credentials.username as string,
          email: credentials.email as string,
          avatar: credentials.avatar as string,
          userToken: credentials.userToken as string,
          role: credentials.role as string,
          // role: typeof credentials.role === "string" ? credentials.role : null,

        };
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
        console.log("JWT Callbacks:", user);
        // await new Promise((resolve) => setTimeout(resolve, 13000));    

      if (user) {
        token.id = user.id;
        token.name = user.username;
        token.username = user.username;
        token.email = user.email;
        token.avatar = user.avatar;
        token.userToken = user.userToken;
        token.role = user.role;         

        try {
          // const decoded: DecodedToken = jwtDecode<DecodedToken>(
          //   user.userToken as string
          // );

          // token.id = decoded.id || 0;
          // token.role = decoded.role || null;
          // token.referralCode = decoded.referralCode || null;

          console.log("JWT Callbacks Token:", token);
          // await new Promise((resolve) => setTimeout(resolve, 13000));    

        } catch (error) {
          console.error("Failed to decode JWT:", error);
          token.role = null;
          token.id = 0;
        }
      }
      return token;
    },
    async session({ token, session }) {
        console.log("Session:", token);

        // Delay sebentar (misalnya 3 detik) supaya kamu bisa lihat log dulu
        // await new Promise((resolve) => setTimeout(resolve, 13000));      

      session.user = {
        ...session.user,
        name:
          typeof token.name === "string"
            ? token.name
            : (token.username as string),
        id: `${token.id ?? ""}`,
        email: token.email as string,
        avatar: token.avatar as string,
        role: token.role as string | null,

      };
      const customSession = session as CustomSession;
      customSession.userToken = token.userToken as string;
      return customSession;
    },
  },
});
