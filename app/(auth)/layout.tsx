"use client";

import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const token = getCookie(AUTH_TOKEN_KEY);
  const router = useRouter();

  // useEffect(() => {
  //   if (token) {
  //     router.push("/overview");
  //   }
  // }, [])
  return (
    <div className="h-screen w-full overflow-auto">
      <div className="bg-auth-gradient fixed inset-0" />
      <div className="bg-[url(/images/cardboard.png)] fixed opacity-40 inset-0" />
      <div className="relative h-screen p-5 flex flex-col w-full">{children}</div>
    </div>
  );
}
