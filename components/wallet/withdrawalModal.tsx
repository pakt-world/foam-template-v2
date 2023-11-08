'use client';
import React, { useState } from 'react';

import {
  ChevronLeft,
  X,
} from 'lucide-react';
import Image from 'next/image';
import {
  Button,
  Checkbox,
  Input,
  Select,
  Text,
} from 'pakt-ui';
import {
  Controller,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import * as z from 'zod';

import { SideModal } from '@/components/common/side-modal';
import { useWithdraw } from '@/lib/api/withdraw';
import { useUserState } from '@/lib/store/account';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  InputErrorMessage,
  OtpInput,
  Spinner,
} from '../common';

const withdrawFormSchema = z.object({
  coin: z.string().min(1, 'Password is required'),
  address: z.string().min(1, 'Address is required'),
  amount: z.number().min(1, '$100 is the minimum required amount for withdrawal'),
  password: z.string().min(1, 'password is required'),
  confirm: z.literal(true, {
    errorMap: () => ({ message: 'You must accept Terms and Conditions' }),
  }),
});

type withdrawFormValues = z.infer<typeof withdrawFormSchema>;

export const WithdrawalModal = ({
  isOpen,
  onChange,
  wallets,
}: {
  isOpen: boolean;
  onChange: (state: boolean) => void;
  wallets: any[];
}) => {
  const [is2FA, _setIs2FA] = useState(false);
  const { twoFa } = useUserState();
  const withdraw = useWithdraw();
  const form = useForm<withdrawFormValues>({
    resolver: zodResolver(withdrawFormSchema),
  });

  const onSubmit: SubmitHandler<withdrawFormValues> = (values) => {
    if (twoFa.status) {
      return _setIs2FA(true);
    } else finalSubmit();
  };

  const finalSubmit = (otp?: string) => {
    const values = form.getValues();
    const payload = {
      address: values.address,
      amount: values.amount,
      coin: values.coin,
      password: values.password,
      otp,
    };
    withdraw.mutate(payload, {
      onSuccess: (data) => {
        form.reset({});
        onChange(false);
      },
    });
  };

  const getWalletIcon = (wallet: any) => {
    return wallet.icon ?? '/icons/usdc-logo.svg';
  }

  const renderOption = (icon: string, coin: string, balance: string) => (
    <div className="flex flex-row text-lg">
      <Image
        width={25}
        height={25}
        className="w-[25px] h-[25px] mr-4"
        src={icon}
        alt={`logo for currency`}
      />
      {coin.toUpperCase()} (${balance})
    </div>
  );

  return (
    <SideModal isOpen={isOpen} onOpenChange={onChange} className="gap-6">
      <div className="flex gap-2 bg-primary-gradient items-center py-6 px-4 text-white">
        <button
          className="bg-white bg-opacity-10 h-10 w-10 border border-white border-opacity-25 rounded-lg flex items-center justify-center"
          onClick={() => onChange(false)}
        >
          <X size={24} onClick={() => onChange(false)} className="cursor-pointer" />
        </button>
        <div className="flex flex-col grow text-center">
          <h3 className="text-2xl font-bold">Withdrawal</h3>
          <p>Withdraw funds to another blockchain wallet</p>
        </div>
      </div>
      {!is2FA ? (
        <>
          <form className="px-6 flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Select
              // @ts-ignore
              options={wallets.map((s: any) => {
                return {
                  label: renderOption(getWalletIcon(s), s.coin, s.usdValue),
                  value: s.coin.toUpperCase(),
                };
              })}
              label="Select Asset"
              placeholder="Choose Asset"
              onChange={(e) => form.setValue('coin', e)}
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Wallet Address</span>
                <span className="text-title font-medium">Network: Avax C-Chain</span>
              </div>

              <div className="relative mb-4">
                <Input type="text" {...form.register('address')} />
                <InputErrorMessage message={form.formState.errors.address?.message} />
              </div>

              <span className="text-info text-left text-sm">
                Ensure you are sending to the right wallet address and on the Avax C-Chain. Sending to a wrong address
                or network can result in loss of funds.
              </span>
            </div>

            <div className="relative">
              <NumericInput value="" onChange={(e) => form.setValue('amount', Number(e))} />
              <InputErrorMessage message={form.formState.errors.amount?.message} />
            </div>

            <div className="relative">
              <Input type="password" label="Password" {...form.register('password')} />
              <InputErrorMessage message={form.formState.errors.password?.message} />
            </div>

            <div className="my-2 relative flex flex-col cursor-pointer">
              <div className="flex flex-row gap-2">
                <Controller
                  name="confirm"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      id="confirm-withdrawal"
                      {...form.register('confirm')}
                      checked={value}
                      onCheckedChange={onChange}
                    />
                  )}
                />
                <label htmlFor="confirm-withdrawal" className="cursor-pointer text-sm">
                  I confirm that all the above details are correct.
                </label>
              </div>

              <InputErrorMessage message={form.formState.errors.confirm?.message} />
            </div>

            <Button disabled={withdraw.isLoading || !form.formState.isValid} fullWidth>
              {withdraw.isLoading ? <Spinner /> : 'Withdraw Funds'}
            </Button>
          </form>
        </>
      ) : (
        <TwoFAInput
          isLoading={withdraw.isLoading}
          onComplete={finalSubmit}
          type={twoFa.type}
          close={() => _setIs2FA(false)}
        />
      )}
    </SideModal>
  );
};

const NumericInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [inputValue, setInputValue] = React.useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.match(/^[0-9]*[.,]?[0-9]*$/)) {
      setInputValue(value);
      onChange(value);
    }
  };

  return (
    <Input
      type="text"
      label="Amount"
      autoCorrect="off"
      autoComplete="off"
      spellCheck="false"
      value={inputValue}
      onChange={handleChange}
    />
  );
};

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

type OtpFormValues = z.infer<typeof otpSchema>;

const TwoFAInput = ({
  isLoading,
  type,
  onComplete,
  close,
}: {
  isLoading: boolean;
  type?: string;
  onComplete: (otp: string) => void;
  close: () => void;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async ({ otp }) => {
    return onComplete(otp);
  };

  return (
    <React.Fragment>
      <div className="flex items-center px-4">
        <div className="flex flex-col items-center w-full text-center p-6 border rounded-2xl">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-row justify-between">
              <ChevronLeft size={24} onClick={close} className="cursor-pointer" />
              <Text.h3 size="xs">{type == 'email' ? 'Email OTP' : 'Authenticator App'}</Text.h3>
              <span></span>
            </div>
            <Text.p size="base">
              Enter the 6 digit code {type === 'email' ? `Sent to your email` : 'generated by your Authenticator app'}
            </Text.p>
          </div>

          <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative mx-auto my-4">
              <Controller
                name="otp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <OtpInput value={value} onChange={onChange} numInputs={6} />
                )}
              />
              <div className="flex justify-center text-center my-2">
                <InputErrorMessage message={errors.otp?.message} />
              </div>
            </div>
            <div className="flex">
              <Button
                type="submit"
                className="w-full justify-end self-end justify-self-end"
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? <Spinner /> : 'Withdraw'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};
