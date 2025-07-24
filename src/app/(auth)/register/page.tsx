// import FormRegister from "@/components/register/form";
import FormRegister from "@/components/form/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register page ",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <FormRegister />
    </div>
  );
}
