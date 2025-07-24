import FormLogin from "@/components/form/login";
// import FormLogin from "@/components/login/form cpy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page ",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <FormLogin />
    </div>
  );
}
