import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string; // 👈 Added this to match usage
      username?: string;
      email: string;
      avatar?: string;
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
    role?: string | null;     // juga di User (opsional)
    userToken?: string;
  }

  interface User {
    id: string;
    name: string; // 👈 Added this to match usage
    username?: string;
    email: string;
    avatar?: string;
    role?: string | null;     // juga di JWT
    userToken?: string;
  }


}