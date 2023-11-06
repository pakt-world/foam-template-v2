'use client';
import React, { useMemo, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { UploadAvatar } from '@/components/common/upload-avatar';
import { ChevronDown, ChevronUp, InfoIcon, Mail, MapPin, Verified } from 'lucide-react';
import { Button, Checkbox, Input, Select as SelectMain, Textarea } from 'pakt-ui';
import { useGetAccount, useUpdateAccount } from '@/lib/api/account';
import { Spinner } from '../common';
import { TagInput } from '../common/tag-input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/common/select';
import countryJson from '@/lib/country.json';

const ProfileStates = [
  { label: 'Private', value: 'true' },
  { label: 'Public', value: 'false' },
];

const editProfileFormSchema = z.object({
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
  title: z.string().min(1, 'Job Title is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  bio: z.string().min(1, 'Bio is required'),
  location: z.string().min(1, 'Location is required'),
  country: z.string().min(1, 'Country is required'),
  tags: z.array(z.string()).nonempty({ message: 'skills are required' }),
  isPrivate: z.boolean().default(false).optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export const ProfileView = () => {
  const [showDelete, setShowDelete] = useState(false);
  const [acceptedDelete, setAcceptedDelete] = useState(false);
  const { data: userAccount, refetch: refetchUser, isFetched, isLoading: accountIsLoading } = useGetAccount();
  const updateAccount = useUpdateAccount();
  const COUNTRY_LIST: { label: string; value: string }[] = (countryJson || []).map((c) => ({
    label: c.name,
    value: c.name,
  }));

  const userData = useMemo(
    () => ({
      ...userAccount,
      firstName: userAccount?.firstName,
      lastName: userAccount?.lastName,
      title: userAccount?.profile?.bio?.title,
      bio: userAccount?.profile?.bio?.description,
      location: userAccount?.profile?.contact?.city,
      country: userAccount?.profile?.contact?.country,
      avatar: userAccount?.profileImage?.url,
      kycVerified: false,
      tags: userAccount?.profile?.talent?.tags || [],
      isPrivate: userAccount?.isPrivate || false,
    }),
    [userAccount],
  );

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: userData,
  });

  const updateAccountFunc = (values: EditProfileFormValues) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      profile: {
        contact: {
          state: values.location,
          city: values.location,
          country: values.country,
        },
        bio: {
          title: values.title,
          description: values.bio,
        },
        talent: {
          tags: [...(values.tags || [])],
        },
      },
    };
    updateAccount.mutate(
      { ...payload },
      {
        onSuccess: (data) => {
          refetchUser();
        },
      },
    );
  };

  const loading = updateAccount.isLoading || form.formState.isLoading;

  const toggleUserProfile = (state: string) => {
    const validState = state == 'true';
    form.setValue('isPrivate', validState);
    return updateAccountFunc({ ...form.getValues(), isPrivate: validState });
  };

  const onSubmit: SubmitHandler<EditProfileFormValues> = (values) => {
    return updateAccountFunc(values);
  };

  if (accountIsLoading) return <Spinner />;

  return (
    <div className="flex flex-row relative gap-6 h-full grow overflow-y-auto">
      <div className="flex flex-col w-1/4 h-fit bg-white rounded-lg items-center">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-end min-h-[27px]">
            <span className="bg-success-lighter text-success py-2 px-4 rounded-xl text-xs font-thin capitalize">
              {form.getValues().isPrivate ? 'Private' : 'Public'}
            </span>
          </div>
          <div className="flex gap-2 flex-col justify-center item-center mx-auto text-center">
            <UploadAvatar size={150} image={userData.avatar} onUploadComplete={refetchUser} />
          </div>
          <div className="flex flex-row justify-center items-center">
            <p className="text-lg font-bold text-title">
              {userData?.firstName} {userData?.lastName}
            </p>
            {userData?.kycVerified && <Verified className="ml-2" />}
          </div>
          <div className="flex flex-row justify-center items-center text-body">
            <Mail className="mr-2" />
            <p className="text-base font-thin text-body">{userData?.email}</p>
          </div>
          <div className="flex flex-row justify-center items-center text-body">
            <MapPin className="mr-2" />
            <p className="text-base font-thin text-body">
              {userData?.location}, {userData?.country}
            </p>
          </div>
          <div className="flex flex-col mt-4">
            <SelectMain
              label="Profile Visibility"
              options={ProfileStates}
              onChange={(e: any) => toggleUserProfile(e)}
              placeholder={form.getValues().isPrivate ? 'Private' : 'Public'}
              className="!bg-[#FCFCFD] !border-[#E8E8E8] capitalize"
            />
            {/* <Select defaultValue={form.getValues().isPrivate ? 'Private' : 'Public'} onValueChange={(e: any) => toggleUserProfile(e)} className="!bg-[#FCFCFD] !border-[#E8E8E8] capitalize">
                  <SelectTrigger className="w-[180px] bg-[#F2F4F5] text-title text-base h-10 rounded-lg">
                    <SelectValue placeholder="Profile Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    {ProfileStates.map(({ label, value }) => (
                      <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
            <p className="text-sm my-4 text-body">Your visibility settings determine if your profile is searchable.</p>
          </div>
        </div>
        {/* <div className='flex flex-row w-full border-t-2 justify-between p-4'>
            <p className='text-title font-thin'>Deactivate Account</p>
            <Switch />
          </div> */}
      </div>
      <form className="flex flex-col w-4/5 overflow-y-auto min-h-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex flex-row justify-between h-[50px] items-center mb-4">
            <p className="text-lg text-title font-bold">Edit Profile Details</p>
            <Button
              title="Save Changes"
              variant={'secondary'}
              size="xs"
              type="submit"
              className="min-w-[132px] min-h-[37px]"
            >
              {loading ? <Spinner size={18} /> : 'Save Changes'}
            </Button>
          </div>
          <div className="flex">
            <div className="flex relative w-full mb-8 mx-auto gap-6 flex-col">
              <div id="input-row" className="flex flex-row justify-between gap-4 w-full">
                <div className="relative w-1/2">
                  <Input
                    {...form.register('firstName')}
                    className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]"
                    placeholder="enter first name"
                    label="First Name"
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.firstName?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.firstName?.message}</span>
                    )}
                  </span>
                </div>
                <div className="relative w-1/2">
                  <Input
                    {...form.register('lastName')}
                    className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]"
                    placeholder="enter last name"
                    label="Last Name"
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.lastName?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.lastName?.message}</span>
                    )}
                  </span>
                </div>
              </div>
              <div id="input-row" className="flex flex-row justify-between gap-4 w-full">
                <div className="relative w-1/2">
                  <Input
                    {...form.register('title')}
                    className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]"
                    placeholder="e.g Developer"
                    label="Job Title"
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.title?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.title?.message}</span>
                    )}
                  </span>
                </div>
                <div className="relative w-1/2">
                  <Input
                    {...form.register('email')}
                    className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]"
                    placeholder="Email Address"
                    label="Email Address"
                    readOnly
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.email?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.email?.message}</span>
                    )}
                  </span>
                </div>
              </div>
              <div id="input-row" className="flex flex-row justify-between gap-4 w-full">
                <div className="relative w-1/2">
                  <Input
                    {...form.register('location')}
                    className="w-full !bg-[#FCFCFD] !border-[#E8E8E8]"
                    placeholder="Enter city"
                    label="City"
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.location?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.location?.message}</span>
                    )}
                  </span>
                </div>

                <div className="relative w-1/2">
                  <Controller
                    name="country"
                    control={form.control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <div className="flex flex-col w-full gap-2">
                          <label> Country</label>
                          <Select defaultValue={value} onValueChange={onChange}>
                            <SelectTrigger className="w-full !bg-[#FCFCFD] !border-[#E8E8E8] text-title text-base h-10 rounded-lg h-[48px]">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] overflow-y-auto">
                              {COUNTRY_LIST.map(({ label, value }) => (
                                <SelectItem key={value} value={value} className="hover:bg-[#ECFCE5] rounded py-2">
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }}
                  />
                  <span className="absolute -bottom-6 flex w-full">
                    {form.formState.errors.country?.message && (
                      <span className="text-sm text-red-500">{form.formState.errors.country?.message}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex flex-row justify-between h-[50px] items-center">
            <p className="text-lg text-title font-bold">Professional Information</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <div className="relative w-1/2">
                <p className="text-sm">Skill Sets</p>
                <div className="min-h-[186px] border !bg-[#FCFCFD] border-primary border-opacity-40 rounded-lg">
                  <Controller
                    name="tags"
                    control={form.control}
                    render={({ field: { onChange, value = [] } }) => (
                      <TagInput
                        tags={value}
                        setTags={onChange}
                        className="items-start grow border-none bg-transparent"
                        placeholder="Add your top 3 skills first"
                      />
                    )}
                  />
                </div>
                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.tags?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.tags?.message}</span>
                  )}
                </span>
              </div>
              <div className="relative w-1/2">
                <p className="text-sm">Bio</p>
                <Textarea
                  maxLength={350}
                  className="!min-h-[186px] w-full !bg-[#FCFCFD]"
                  {...form.register('bio')}
                  placeholder="Enter a 350 character about thing"
                />
                <div className="text-body w-fit text-sm ml-auto">{form.watch('bio')?.length ?? 0} / 350</div>

                <span className="absolute -bottom-6 flex w-full">
                  {form.formState.errors.bio?.message && (
                    <span className="text-sm text-red-500">{form.formState.errors.bio?.message}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 mb-8">
          <div
            className="flex flex-row justify-between h-[50px] items-center cursor-pointer"
            onClick={() => setShowDelete(!showDelete)}
          >
            <p className="text-lg text-title font-bold">Delete Account</p>
            {showDelete ? <ChevronUp /> : <ChevronDown />}
          </div>
          {showDelete && (
            <div className="flex flex-col gap-4 my-4">
              <div className="flex flex-row gap-4 bg-yellow p-4 rounded-lg">
                <InfoIcon size={40} />
                <div>
                  <p className="text-title text-base font-bold">You’re Deleting Your Account</p>
                  <p className="text-title text-sm font-thin leading-5">
                    Deleting your account will permanently remove all data associated with it, including projects, APIs,
                    and analytics. This action cannot be undone. Please make sure you have downloaded any necessary data
                    or backups before proceeding with account deletion.
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    title="I confirm my account deletion"
                    checked={acceptedDelete}
                    onCheckedChange={() => setAcceptedDelete(!acceptedDelete)}
                  />
                  I confirm my account deletion
                </div>
                <Button variant="danger" size="md" disabled={!acceptedDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
