
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLayout from "./client-layout";

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log(session?.user?.role); // 'user', 'admin', dsb
  console.log(session?.userToken);  // JWT
  // console.log(session?.user?.id);

  console.log("SESSION:", JSON.stringify(session, null, 2)); // tampil rapi


  if (!session) {
    redirect("/");
    // redirect("/login");
  }

  return <ClientLayout>{children}</ClientLayout>;
}
