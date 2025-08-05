import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string; // 👈 Added this to match usage
      username?: string;
      email: string;
      avatar?: string;
      picture?: string;
      auth_type: string;
      role?: string | null;    // tambahkan role di sini
    };
    userToken?: string;
  }

  interface JWT {
    id: string;
    name: string; // 👈 Added this to match usage
    username?: string;
    email: string;
    avatar?: string;
    picture?: string;
    role?: string | null;     // juga di User (opsional)
    userToken?: string;
    auth_type: string;
  }

  interface User {
    id: string;
    name: string; // 👈 Added this to match usage
    username?: string;
    email: string;
    avatar?: string;
    picture?: string;
    role?: string | null;     // juga di JWT
    userToken?: string;
    auth_type: string;
  }


}