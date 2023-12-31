'use client';
import * as z from 'zod';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { setCookie } from 'cookies-next';
import ReactOTPInput from 'react-otp-input';
import { formatCountdown } from '@/lib/utils';
import { Spinner } from '@/components/common';
import { AUTH_TOKEN_KEY } from '@/lib/utils';
import { toast } from '@/components/common/toaster';
import { Container } from '@/components/common/container';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResendOTP, useLoginOTP } from '@/lib/api';
import { TWO_FA_CONSTANTS } from '@/lib/constants';

const formSchema = z.object({
  otp: z.string().min(6, { message: 'OTP is required' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupVerifyEmail() {
  const [countdown, setCountdown] = React.useState(0);
  const [isResendDisabled, setIsResendDisabled] = React.useState(false);

  const router = useRouter();
  const resendOTP = useResendOTP();
  const loginOTP = useLoginOTP();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const verifyType = searchParams.get('type');

  React.useEffect(() => {
    if (verifyType == TWO_FA_CONSTANTS.EMAIL) {
      setIsResendDisabled(true);
    }
  }, []);

  React.useEffect(() => {
    if (isResendDisabled) {
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      setTimeout(() => setIsResendDisabled(false), 60000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isResendDisabled]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = ({ otp }) => {
    if (typeof verifyType !== 'string' || typeof token !== 'string') {
      return router.push('/signup');
    }
    loginOTP.mutate(
      {
        code: otp,
        tempToken: token,
      },
      {
        onSuccess: (data) => {
          // @ts-ignore
          setCookie(AUTH_TOKEN_KEY, data.token);
          return router.push('/overview');
        },
      },
    );
  };

  const handleResendOTP = () => {
    const email = searchParams.get('email');

    if (typeof email !== 'string') {
      return router.push('/signup');
    }

    resendOTP.mutate(
      {
        email,
      },
      {
        onSuccess: () => {
          setIsResendDisabled(true);
          toast.success('OTP sent successfully');
        },
      },
    );
  };

  return (
    <div>
      <Container className="flex items-center justify-between mt-16">
        <Link className="max-w-[200px]" href="/">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </Link>
      </Container>

      <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h3 className="font-sans text-3xl font-bold">2FA Security</h3>
          <p className="font-sans text-base">
            {verifyType === TWO_FA_CONSTANTS.AUTHENTICATOR
              ? 'Enter the OTP from your authenticator'
              : `Enter the code that was sent to ${email}`}
          </p>
        </div>
        <form
          className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-fit gap-4">
            <Controller
              name="otp"
              control={form.control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ReactOTPInput
                    value={value}
                    onChange={onChange}
                    shouldAutoFocus={true}
                    numInputs={6}
                    containerStyle="gap-3 flex"
                    inputStyle={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '4px',
                      border: '1px solid #D0DDD5',
                    }}
                    renderInput={(props) => (
                      <input
                        {...props}
                        className="w-full rounded-md px-3 !select-none py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    )}
                  />
                );
              }}
            />

            <Button fullWidth disabled={loginOTP.isLoading || !form.formState.isValid}>
              {loginOTP.isLoading ? <Spinner /> : 'Submit'}
            </Button>

            {verifyType == TWO_FA_CONSTANTS.EMAIL && (
              <div className="flex flex-col gap-4 items-center w-full">
                <span className="text-white">{formatCountdown(countdown)}</span>
                <div className="w-full max-w-[150px]">
                  <Button
                    size="xs"
                    fullWidth
                    variant="secondary"
                    onClick={handleResendOTP}
                    disabled={resendOTP.isLoading || isResendDisabled}
                  >
                    {resendOTP.isLoading ? <Spinner size={16} /> : 'Resend Code'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </Container>
    </div>
  );
}
