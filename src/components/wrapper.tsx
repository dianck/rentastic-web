import { ReactNode } from "react";

export default function Wrapper({ children }: { children: ReactNode }) {
  return <div className="md:px-[160px] sm:px-12 px-5 ">{children}</div>;
}
