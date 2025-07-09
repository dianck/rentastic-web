import { getBrandName } from "@/lib/brand";
import Image from "next/image";

export const LoadingComp = () => {
  return (
    <div className="flex w-full h-screen justify-center items-center perspective-1000 bg-white">
      <div className="text-black flex gap-2 animate-bounce">
        <Image
          alt="logo-eventique"
          src={"/logo4.png"}
          width={100}
          height={100}
          className="h-8 w-8"
          priority
        />
        <span className="self-center text-2xl font-semibold whitespace-nowrap animate-pulse">
          { getBrandName()}
        </span>
      </div>
    </div>
  );
};
