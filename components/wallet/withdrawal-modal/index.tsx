"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Button, Checkbox, Input, Select } from "pakt-ui";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { SideModal } from "@/components/common/side-modal";
import { useWithdraw } from "@/lib/api/withdraw";
import { useUserState } from "@/lib/store/account";
import { InputErrorMessage, Spinner } from "../../common";
import { withdrawFormSchema } from "@/lib/validations";
import { TwoFAInput } from "./2fa-input";
import { NumericInput } from "./numeric-input";

type withdrawFormValues = z.infer<typeof withdrawFormSchema>;

export const WithdrawalModal = ({
    isOpen,
    onChange,
    wallets,
    network = "Avax C-Chain",
}: {
    isOpen: boolean;
    onChange: (state: boolean) => void;
    wallets:
        | Array<{
              _id: string;
              amount: number;
              usdValue: number;
              coin: string;
              icon?: string;
          }>
        | [];
    network: string;
}): React.JSX.Element => {
    const [is2FA, _setIs2FA] = useState(false);
    const { twoFa } = useUserState();
    const withdraw = useWithdraw();

    const form = useForm<withdrawFormValues>({
        resolver: zodResolver(withdrawFormSchema),
    });

    const finalSubmit = (otp?: string): void => {
        const values = form.getValues();
        const payload = {
            address: values.address,
            amount: values.amount,
            coin: values.coin,
            password: values.password,
            otp,
        };
        withdraw.mutate(payload, {
            onSuccess: () => {
                form.reset({});
                onChange(false);
            },
        });
    };

    const onSubmit: SubmitHandler<withdrawFormValues> = (): void => {
        if (twoFa?.status) {
            _setIs2FA(true);
            return;
        }
        finalSubmit();
    };

    const getWalletIcon = (wallet: { icon?: string }): string => {
        return wallet.icon ?? "/icons/usdc-logo.svg";
    };

    const renderOption = (icon: string, coin: string, balance: string): React.JSX.Element => (
        <div className="flex flex-row text-lg">
            <Image width={25} height={25} className="mr-4 h-[25px] w-[25px]" src={icon} alt="logo for currency" />
            {coin.toUpperCase()} (${balance})
        </div>
    );

    return (
        <SideModal isOpen={isOpen} onOpenChange={onChange} className="gap-6">
            <div className="flex items-center gap-2 bg-primary-gradient px-4 py-6 text-white">
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white border-opacity-25 bg-white bg-opacity-10"
                    onClick={() => {
                        onChange(false);
                    }}
                    type="button"
                    aria-label="Close Modal"
                >
                    <X
                        size={24}
                        onClick={() => {
                            onChange(false);
                        }}
                        className="cursor-pointer"
                    />
                </button>
                <div className="flex grow flex-col text-center">
                    <h3 className="text-2xl font-bold">Withdrawal</h3>
                    <p>Withdraw funds to another blockchain wallet</p>
                </div>
            </div>
            {!is2FA ? (
                <form className="flex flex-col gap-6 px-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <Select
                        // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                        options={wallets.map(
                            (s: { _id: string; amount: number; usdValue: number; coin: string; icon?: string }) => {
                                return {
                                    label: renderOption(getWalletIcon(s), s.coin, s.usdValue.toString()),
                                    value: s.coin.toUpperCase(),
                                };
                            },
                        )}
                        label="Select Asset"
                        placeholder="Choose Asset"
                        onChange={(e) => {
                            form.setValue("coin", e);
                        }}
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span>Wallet Address</span>
                            <span className="font-medium text-title">Network: {network}</span>
                        </div>

                        <div className="relative mb-4">
                            <Input type="text" {...form.register("address")} />
                            <InputErrorMessage message={form.formState.errors.address?.message} />
                        </div>

                        <span className="text-left text-sm text-info">
                            Ensure you are sending to the right wallet address and on the Avax C-Chain. Sending to a
                            wrong address or network can result in loss of funds.
                        </span>
                    </div>

                    <div className="relative">
                        <NumericInput
                            value=""
                            onChange={(e) => {
                                form.setValue("amount", Number(e));
                            }}
                        />
                        <InputErrorMessage message={form.formState.errors.amount?.message} />
                    </div>

                    <div className="relative">
                        <Input type="password" label="Password" {...form.register("password")} />
                        <InputErrorMessage message={form.formState.errors.password?.message} />
                    </div>

                    <div className="relative my-2 flex cursor-pointer flex-col">
                        <div className="flex flex-row gap-2">
                            <Controller
                                name="confirm"
                                control={form.control}
                                render={({ field: { onChange: change, value } }) => (
                                    <Checkbox
                                        id="confirm-withdrawal"
                                        {...form.register("confirm")}
                                        checked={value}
                                        onCheckedChange={change}
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
                        {withdraw.isLoading ? <Spinner /> : "Withdraw Funds"}
                    </Button>
                </form>
            ) : (
                <TwoFAInput
                    isLoading={withdraw.isLoading}
                    onComplete={finalSubmit}
                    type={twoFa?.type}
                    close={() => {
                        _setIs2FA(false);
                    }}
                />
            )}
        </SideModal>
    );
};
