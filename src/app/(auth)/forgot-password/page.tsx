import ForgotPassword from "@/components/form/forgot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password",
};

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <ForgotPassword />
    </div>
  );
}
