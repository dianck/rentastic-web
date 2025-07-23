import FormLogin from "@/components/form/login";
// import FormLogin from "@/components/login/form cpy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page ",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <FormLogin />
      </div>
    </div>
  );
}
