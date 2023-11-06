'use client';
import React, {
  useMemo,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  useParams,
  useRouter,
} from 'next/navigation';
import {
  Button,
  Input,
} from 'pakt-ui';
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import * as z from 'zod';

import {
  InputErrorMessage,
  Spinner,
} from '@/components/common';
import { Container } from '@/components/common/container';
import { PasswordCriteria } from '@/components/settings/security';
import { useSignUp } from '@/lib/api';
import { useValidateReferral } from '@/lib/api/referral';
import { useGetSetting } from '@/lib/api/setting';
import { SETTING_CONSTANTS } from '@/lib/constants';
import {
  createQueryStrings,
  spChars,
} from '@/lib/utils';
import warning from '@/lottiefiles/warning-2.json';
import { zodResolver } from '@hookform/resolvers/zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .regex(/[0-9]/, 'Password must contain at least one number.')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character.');

const formSchema = z
  .object({
    lastName: z.string().min(1, { message: 'Name is required' }),
    firstName: z.string().min(1, { message: 'Name is required' }),
    email: z.string().min(1, { message: 'Email is required' }).email('Please enter a valid email address.'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type FormValues = z.infer<typeof formSchema>;

export default function Signup() {
  const signup = useSignUp();
  const validateRef = useValidateReferral();
  const router = useRouter();
  const params = useParams();
  const [isLoading, _setIsLoading] = useState(false);
  const [errorMsg, _setErrorMsg] = useState(true);
  const { data: systemSetting, isLoading: settingsLoading } = useGetSetting();
  const loading = settingsLoading || isLoading;

  useMemo(() => {
    if (systemSetting) {
      const signupByInviteONly = Boolean(systemSetting[SETTING_CONSTANTS.ALLOW_SIGN_ON_INVITE_ONLY] === "true");
      _setErrorMsg(signupByInviteONly)
    }
  }, [systemSetting]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    signup.mutate(
      { ...values },
      {
        onSuccess: ({ tempToken, email }) => {
          router.push(
            `/signup/verify?${createQueryStrings([
              {
                name: 'email',
                value: email,
              },
              {
                name: 'token',
                value: tempToken.token,
              },
            ])}`,
          );
        },
      },
    );
  };

  const validatingErr = useMemo(() => ({
    isMinLength: form.getValues().password && form.getValues().password.length >= 8 || false,
    checkLowerUpper: form.getValues().password && /[A-Z]/.test(form.getValues().password) && /[a-z]/.test(form.getValues().password) || false,
    checkNumber: form.getValues().password && form.getValues().password.match(/\d+/g) ? true : false,
    specialCharacter: form.getValues().password && spChars.test(form.getValues().password) || false,
    confirmedPassword: form.getValues().password === form.getValues().confirmPassword && form.getValues().password != "",
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [form.watch("password"), form.watch("confirmPassword")]);

  return (
    <React.Fragment>
      <Container className="flex items-center justify-between mt-16">
        <div className="max-w-[200px]">
          <Image src="/images/logo.svg" alt="Logo" width={250} height={60} />
        </div>

        {!loading && (
          <Link
            className="rounded-lg border-2 bg-white !bg-opacity-10 px-5 py-2 text-white duration-200 hover:bg-opacity-30"
            href="/login"
          >
            Login
          </Link>
        )}
      </Container>
      {!loading && !errorMsg && (
        <Container className="flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2 text-center text-white">
            <h3 className="font-sans text-3xl font-bold">Create Your Account</h3>
            {/* <p className="font-sans text-base">Create Your Account</p> */}
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex relative z-[100] w-full mx-auto max-w-[600px] flex-col bg-[rgba(0,124,91,0.20)] backdrop-blur-md items-center gap-6 rounded-2xl border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg"
          >
            <div className="flex gap-4 flex-col w-full">
              <div className="grid gap-4 grid-cols-2">
                <div className="flex flex-col gap-2 relative mb-2">
                  <label htmlFor="firstName" className="text-white text-sm">
                    First Name
                  </label>
                  <Input id="firstName" {...form.register('firstName')} placeholder="First Name" />
                  <InputErrorMessage message={form.formState.errors.firstName?.message} />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label htmlFor="lastName" className="text-white text-sm">
                    Last Name
                  </label>
                  <Input id="lastName" {...form.register('lastName')} placeholder="Last Name" />
                  <InputErrorMessage message={form.formState.errors.lastName?.message} />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative mb-2">
                <label htmlFor="email" className="text-white text-sm">
                  Email Address
                </label>
                <Input id="email" {...form.register('email')} placeholder="Email Address" />
                <InputErrorMessage message={form.formState.errors.email?.message} />
              </div>

              <div className="flex flex-col gap-2 relative mb-2">
                <label htmlFor="password" className="text-white text-sm">
                  Create Password
                </label>
                <Input
                  id="password"
                  {...form.register('password')}
                  className=""
                  placeholder="Password"
                  type="password"
                />
                <div className="flex flex-col p-4 text-body text-xs gap-4">
                  <PasswordCriteria isValidated={validatingErr.isMinLength} criteria="At least 8 characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.checkLowerUpper} criteria="Upper and lower case characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.checkNumber} criteria="1 or mote numbers" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.specialCharacter} criteria="1 or more special characters" isSignUp={true} />
                  <PasswordCriteria isValidated={validatingErr.confirmedPassword} criteria="passwords must be match" isSignUp={true} />
                </div>
              </div>

              <div className="flex flex-col gap-2 relative mb-2">
                <label htmlFor="confirmPassword" className="text-white text-sm">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  {...form.register('confirmPassword')}
                  className=""
                  placeholder="Confirm Password"
                  type="password"
                />
              </div>
            </div>

            <Button className="" fullWidth disabled={!form.formState.isValid || signup.isLoading}>
              {signup.isLoading ? <Spinner /> : 'Signup'}
            </Button>
          </form>
        </Container>
      )}
      {loading && (
        <div className="flex h-full justify-center text-white">
          <Spinner />
        </div>
      )}
      {!loading && errorMsg && (
        <Container className="mt-28 text-white text-center flex w-full max-w-xl flex-col items-center gap-2 justify-center p-8 rounded-2xl mx-auto  bg-[rgba(0,124,91,0.20)] backdrop-blur-md border border-white border-opacity-20 bg-[rgba(0, 124, 91, 0.20)] px-[40px] py-10 backdrop-blur-lg">
          <div className="max-w-[150px] w-full flex items-center justify-center">
            <Lottie animationData={warning} />
          </div>
          <h3 className="text-3xl font-bold">Invalid Referral Code</h3>
          <h6 className="text-lg font-thin flex-wrap opacity-[0.8]">
            You need a valid referral code to be able to sign up to Afrofund.{' '}
          </h6>
        </Container>
      )}
    </React.Fragment>
  );
}
