'use client';
import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
} from 'pakt-ui';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import * as z from 'zod';

import { Spinner } from '@/components/common';
import { Container } from '@/components/common/container';
import { useRequestPasswordReset } from '@/lib/api';
import { createQueryStrings } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email('Please enter a valid email address.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConfirmEmail() {
  const router = useRouter();
  const requestPasswordReset = useRequestPasswordReset();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    requestPasswordReset.mutate(values, {
      onSuccess: (data) => {
        router.push(`/forgot-password/reset?${createQueryStrings([
          {
            name: 'email',
            value: values.email,
          },
          {
            name: 'token',
            value: data.tempToken.token,
          },
        ])}`);
      },
    });
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
          <h3 className="font-sans text-3xl font-bold">Forgot Password</h3>
          <p className="font-sans text-base max-w-md">
            Enter the email you used to create your account so we can send you instructions on how to reset your
            password.
          </p>
        </div>
        <form
          className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="relative w-full gap-2 flex flex-col">
            <label className="text-sm font-sans text-white" htmlFor="email">
              Email
            </label>
            <Input {...form.register('email')} placeholder="Email" type="email" className="w-full" id="email" />
          </div>

          <Button fullWidth disabled={!form.formState.isValid || requestPasswordReset.isLoading}>
            {requestPasswordReset.isLoading ? <Spinner /> : 'Send Reset Link'}
          </Button>

          <Link href="/login" className="text-white text-sm font-sans mt-4">
            Back to login
          </Link>
        </form>
      </Container>
    </div>
  );
}
