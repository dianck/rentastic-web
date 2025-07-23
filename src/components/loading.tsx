// import { getBrandName } from "@/lib/brand";
// import Image from "next/image";
import { Home } from "lucide-react";

export const LoadingComp = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center perspective-1000 bg-white">
      <div className="text-black flex gap-2 animate-bounce">
        {/* <Image
          alt="logo-eventique"
          src={"/logo4.png"}
          width={100}
          height={100}
          className="h-8 w-8"
          priority
        /> */}
        <Home className="h-6 w-6" />
        <span className="self-center text-2xl font-semibold whitespace-nowrap animate-pulse">
           {process.env.NEXT_PUBLIC_APP_NAME || 'NestEase'}
        </span>
      </div>
    </div>
  );
};
