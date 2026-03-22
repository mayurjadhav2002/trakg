"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { DotLottiePlayer } from "@dotlottie/react-player";

export const VerifyingLoader = () => (
  <div className="flex flex-col items-center justify-center mt-32 text-center w-full dark:bg-transparent">
    <DotLottiePlayer
      autoplay
      loop
      src="/assets/lottie/loading_lottie_blue.json"
      style={{ height: 200, width: 200 }}
    />
  </div>
);

