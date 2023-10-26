'use client';
import * as z from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { useLogin } from '@/lib/api';
import { Input, Button, PasswordInput } from 'pakt-ui';
import { setCookie } from 'cookies-next';
import { createQueryStrings } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Container } from '@/components/common/container';
import { useRouter } from 'next/navigation';

import { Spinner } from '@/components/common';
import { useUserState } from '@/lib/store/account';
import { AUTH_TOKEN_KEY } from '@/lib/utils';

const loginFormSchema = z.object({
  password: z.string().min(1, 'Password is required').min(8, 'Password is too short'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const login = useLogin();
  const router = useRouter();
  const { setUser } = useUserState();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    login.mutate(values, {
      onSuccess: (data) => {
        if (!data.isVerified) {
          return router.push(
            `/signup/verify?${createQueryStrings([
              { name: 'email', value: data.email },
              { name: 'token', value: data.tempToken?.token || '' },
              { name: 'verifyType', value: 'email' },
            ])}`,
          );
        } else if (data.twoFa?.status) {
          return router.push(
            `/login/verify?${createQueryStrings([
              { name: 'token', value: data.tempToken?.token || '' },
              { name: 'verifyType', value: '2fa' },
              { name: 'type', value: data.twoFa.type },
            ])}`,
          );
        } else {
          // @ts-ignore
          setUser(data);
          setCookie(AUTH_TOKEN_KEY, data.token);
          return router.push('/overview');
        }
      },
    });
  };

  return (
    <div>
      <Container className="flex items-center justify-between mt-16">
        <div className="max-w-[200px]">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </div>
      </Container>

      <Container className="mt-28 flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center text-white">
          <h3 className="font-sans text-3xl font-bold">Login to your account</h3>
          <p className="font-sans text-base">Connecting African Talent to Global Opportunity</p>
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full mx-auto max-w-[600px] flex-col bg-primary bg-opacity-20 backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 px-[40px] py-10"
        >
          <div className="flex gap-4 flex-col w-full">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white text-sm">
                Email Address
              </label>

              <Input {...form.register('email')} className="" placeholder="Email Address" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-white text-sm">
                Password
              </label>
              <PasswordInput {...form.register('password')} className="" placeholder="Password" />
            </div>

            <div className="items-center justify-end flex">
              <Link href="/forgot-password" className="text-white text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button fullWidth disabled={!form.formState.isValid || login.isLoading}>
            {login.isLoading ? <Spinner /> : 'Login'}
          </Button>
        </form>
      </Container>
    </div>
  );
}
