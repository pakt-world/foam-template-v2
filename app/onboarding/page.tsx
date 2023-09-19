'use client';

import clsx from 'clsx';
import React from 'react';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';
import { Spinner, Slider, SlideItemProps } from '@/components/common';
import type { LucideIcon } from 'lucide-react';
import { useUpdateAccount } from '@/lib/api/account';
import { PenTool, Terminal, Users, Feather, Library, Volume2, Edit3 } from 'lucide-react';
import { toast } from '@/components/common/toaster';
import { useDropzone } from 'react-dropzone';
import { useUploadImage } from '@/lib/api/upload';
import { useOnboardingState } from '@/lib/store/onboarding';
import { GallerySvg } from '@/components/common/gallery-svg';
import Image from 'next/image';

const SKILLS = [
  { label: 'Design', value: 'design', Icon: PenTool },
  { label: 'Engineering', value: 'engineering', Icon: Terminal },
  { label: 'Product', value: 'product', Icon: Library },
  { label: 'Marketing', value: 'marketing', Icon: Volume2 },
  { label: 'Copywriting', value: 'copywriting', Icon: Feather },
  { label: 'Others', value: 'others', Icon: Users },
];

const Skills = ({ goToNextSlide }: SlideItemProps) => {
  const { skill, setSkill } = useOnboardingState();
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-4">
      <div className="flex flex-col text-left w-full gap-1">
        <p className="text-2xl">Great to meet you, Leslie.</p>
        <span className="text-4xl font-bold text-[#1f2739]">What are you interested in?</span>
      </div>
      <div className="mt-9 grid grid-cols-3 gap-6 w-full">
        {SKILLS.map(({ Icon, label, value }) => (
          <SkillCard
            key={value}
            label={label}
            Icon={Icon}
            isActive={skill === value}
            toggleSelection={() => {
              setSkill(value);
            }}
          />
        ))}
      </div>
      <div className="mx-auto max-w-xs w-full mt-2">
        <Button fullWidth disabled={!skill} onClick={goToNextSlide}>
          Continue
        </Button>
      </div>
    </div>
  );
};

const ProfileImage = () => {
  const router = useRouter();
  const { skill } = useOnboardingState();
  const uploadImage = useUploadImage();
  const updateAccount = useUpdateAccount();
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const [imageFile, setImageFile] = React.useState<{ file: File; preview: string; } | null>(null);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile({
      file,
      preview: URL.createObjectURL(file),
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, accept: { 'image/*': [], }, });

  React.useEffect(() => {
    return () => {
      if (imageFile) {
        URL.revokeObjectURL(imageFile.preview);
      }
    };
  }, [imageFile]);

  const handleUpload = async () => {
    if (!imageFile) return;
    uploadImage.mutate(
      { file: imageFile.file, onProgress: setUploadProgress },
      {
        onSuccess: (data) => {
          // save account details
          const payload = { profile: { bio: { title: skill }, }, profileImage: data._id, }
          updateAccount.mutate(payload,
            {
              onSuccess: () => {
                toast.success('Image uploaded successfully');
                router.push('/overview');
              },
            },
          );
        },
      },
    );
  };

  return (
    <div className="flex w-full shrink-0 gap-4 flex-col items-center">
      <div className="flex flex-col items-center text-body">
        <p className="text-lg">Last Step</p>
        <span className="text-2xl font-bold text-title">Create Your Avatar</span>
        <span className="text-base text-[#6c757d]">Upload an Image</span>
      </div>

      <div
        className="relative flex items-center justify-center border overflow-hidden rounded-full h-[270px] w-[270px] bg-[#ECFCE5] hover:bg-lime-50 duration-200 cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col gap-2 text-center items-center ">
          <GallerySvg />
          <span className="text-body flex flex-col gap-1">
            <span>
              <span className="text-[#23C16B]">Click</span>
              <span> or drag and drop</span>
            </span>
            <span> to upload</span>
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {imageFile && <Image src={imageFile.preview} alt="profile picture" layout="fill" objectFit="cover" />}
        </div>

        {imageFile && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="flex items-center gap-2 bg-green-200 text-primary border border-primary px-2 py-1 rounded-sm mt-10">
              <Edit3 size={24} />
              <span className="text-sm">Change Image</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-[80px] w-full flex items-center justify-center">
        {(uploadImage.isLoading || updateAccount.isLoading) ? (
          <UploadProgress progress={uploadProgress} />
        ) : (
          <div className="max-w-xs w-full">
            <Button size="sm" fullWidth disabled={!imageFile} onClick={handleUpload}>
              Upload Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface UploadProgressProps {
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="flex flex-col w-full max-w-sm bg-[#ECFCE533] p-4 rounded-2xl gap-2 border border-[#7DDE86]">
      <span className="text-sm">Uploading</span>
      <div className="w-full h-[8px] rounded-full overflow-hidden bg-[#EBEFF2]">
        <div
          className="h-full bg-primary-gradient rounded-full"
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default function OnBoarding() {
  return (
    <React.Fragment>
      <Slider
        items={[
          { SlideItem: Skills },
          { SlideItem: ProfileImage },
        ]}
      />
    </React.Fragment>
  )
}

interface SkillCardProps {
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  toggleSelection: () => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ label, Icon, isActive, toggleSelection }) => {
  return (
    <button
      onClick={toggleSelection}
      className={clsx(
        'text-title flex flex-col min-w-[200px] items-start gap-4 rounded-lg border p-6 duration-200 hover:bg-gray-100',
        {
          'border-[#E8E8E8] bg-[#FCFCFC]': !isActive,
          'border-[#007C5B] bg-[#007C5B1A]': isActive,
        },
      )}
    >
      <Icon size={32} />
      <span className="text-2xl">{label}</span>
    </button>
  );
};
