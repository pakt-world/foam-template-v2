'use client';
import React, { useState } from 'react';
import { Sidebar } from '@/components/sidebar';

import { axios } from '@/lib/axios';
import { RaceBy } from '@uiball/loaders';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { AUTH_TOKEN_KEY } from '@/lib/utils';
import { useGetAccount } from '@/lib/api/account';
import { MessagingProvider } from '@/providers/socketProvider';

const Loader = () => {
  return (
    <div aria-live="polite" aria-busy="true" className="flex h-screen w-screen items-center justify-center">
      <RaceBy />
    </div>
  );
};

interface DashProps {
  children: React.ReactNode | any;
  tokenSet?: boolean;
}

function AccountWrapper({ children, tokenSet }: DashProps) {
  const { isFetched, isFetching } = useGetAccount();

  if (!tokenSet || (!isFetched && isFetching)) {
    return <Loader />;
  }

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = getCookie(AUTH_TOKEN_KEY);
  const [isTokenSet, setIsTokenSet] = useState(false);

  React.useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsTokenSet(true);
    }
    return () => {
      axios.defaults.headers.common['Authorization'] = '';
    };
  }, [router, token]);

  if (!isTokenSet) {
    return <Loader />;
  }

  return (
    <AccountWrapper tokenSet={isTokenSet}>
      <MessagingProvider>
        <div className="flex max-w-full h-screen w-screen overflow-y-hidden">
          <Sidebar />

          <div className="relative w-full">
            <div className="absolute z-[1] inset-0">
              <div className="isolate">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1512 989" fill="none">
                  <g filter="url(#filter0_f_4656_140202)">
                    <path
                      d="M1008.86 223.475L841.933 115.026L749.197 169.251C728.59 187.326 687.374 230.983 687.374 261.015C687.374 298.555 684.283 361.121 687.374 381.977C690.465 402.832 841.933 473.741 875.936 469.57C909.939 465.399 1030.49 494.597 1079.95 548.821C1129.41 603.045 1132.5 628.072 1243.79 682.296C1355.07 736.52 1367.43 665.612 1407.62 628.072C1447.8 590.532 1475.62 448.714 1503.45 361.121C1531.27 273.528 1481.81 223.475 1475.63 169.251C1470.68 125.871 1413.8 115.026 1385.98 115.026L1243.79 90L1008.86 223.475Z"
                      fill="#BCF78C"
                      fillOpacity="0.5"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_f_4656_140202"
                      x="-79.7596"
                      y="-675.76"
                      width="2357.39"
                      height="2143.52"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="382.88" result="effect1_foregroundBlur_4656_140202" />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute bg-repeat opacity-50 inset-0 bg-[url(/images/rain.png)]" />
            <div className="relative h-full pt-5 px-8 z-10 flex flex-col w-full isolate">{children}</div>
          </div>
        </div>
      </MessagingProvider>
    </AccountWrapper>
  );
}
