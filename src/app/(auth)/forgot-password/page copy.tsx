import ForgotPassword from "@/components/form/forgot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <ForgotPassword />
      </div>
    </div>
  );
}
