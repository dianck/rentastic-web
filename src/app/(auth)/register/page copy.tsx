// import FormRegister from "@/components/register/form";
import FormRegister from "@/components/form/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Register page ",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        {/* <h2 className="text-2xl font-bold mb-4">Sign Up</h2> */}
        <FormRegister />
      </div>
    </div>
  );
}
