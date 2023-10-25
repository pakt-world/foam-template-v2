import React from 'react';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { useUploadImage } from '@/lib/api/upload';
import { useUpdateAccount } from '@/lib/api/account';
import { useDropzone } from 'react-dropzone';
import { Edit3, AlertCircle, FileWarning } from 'lucide-react';
import { GallerySvg } from '@/components/common/gallery-svg';
import { DefaultAvatar } from './default-avatar';
import { toast } from '@/components/common/toaster';

interface Props {
  size?: number;
  image?: string;
  onUploadComplete?: () => void;
}

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES; // 2MB

export const UploadAvatar: React.FC<Props> = ({ image, size: previewImageSize = 180, onUploadComplete }) => {
  const uploadImage = useUploadImage();
  const updateAccount = useUpdateAccount();
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [previewImage, setPreviewImage] = React.useState<{ file: File; preview: string } | null>();

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setPreviewImage({
      file,
      preview: window.URL.createObjectURL(file),
    });
  }, []);

  React.useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage.preview);
      }
    };
  }, [previewImage]);

  const { getRootProps, getInputProps, fileRejections, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    minSize: 0,
    maxFiles: 1,

    accept: {
      ['image/png']: [],
      ['image/jpg']: [],
      ['image/jpeg']: [],
    },
  });
  const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

  const handleUpload = async () => {
    if (!previewImage) return;
    uploadImage.mutate(
      { file: previewImage.file, onProgress: setUploadProgress },
      {
        onSuccess: ({ _id }) => {
          updateAccount.mutate(
            {
              profileImage: _id,
            },
            {
              onSuccess: () => {
                onUploadComplete && onUploadComplete();
              },
            },
          );
          setPreviewImage(null);
        },
        onError: (err) => {
          setPreviewImage(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        {...getRootProps()}
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-[#ECFCE5] duration-200 cursor-pointer group"
        style={{
          width: previewImageSize,
          height: previewImageSize,
        }}
      >
        <input {...getInputProps()} />

        <div className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden">
          {previewImage ? (
            <Image src={previewImage.preview} alt="profile picture" layout="fill" objectFit="cover" />
          ) : image ? (
            <Image src={image} alt="profile picture" layout="fill" objectFit="cover" />
          ) : (
            <DefaultAvatar />
          )}
        </div>

        <div className="z-20 text-[#23C16B] group-hover:bg-black group-hover:bg-opacity-70 group-hover:opacity-100 duration-200 opacity-0 flex-col gap-2 text-center items-center p-2 rounded-full absolute inset-0 flex justify-center">
          <div>
            <GallerySvg size={24} />
          </div>
          <span className="text-green-200 flex flex-col gap-1 text-xs">
            <span>
              <span className="">Click</span>
              <span> or drag and drop</span>
            </span>
            <span> to upload image</span>
          </span>
        </div>

        <div
          className="text-sm duration-200 border border-red-200 rounded-full z-30 pointer-events-none flex-col justify-center px-4 text-red-500 flex items-center gap-1 absolute inset-0 bg-red-100"
          style={{
            opacity: isDragReject ? 1 : 0,
          }}
        >
          <FileWarning size={36} />
          <span className="text-xs">File type not supported</span>
        </div>
      </div>

      {uploadImage.isLoading && <UploadProgress progress={uploadProgress} />}

      {previewImage && !uploadImage.isLoading && !isFileTooLarge && (
        <button
          onClick={handleUpload}
          className="px-2 capitalize rounded-lg text-green-700 h-[28px] bg-green-200 w-full hover:bg-opacity-50 duration-200 border border-primary text-xs font-medium"
        >
          Set new profile picture
        </button>
      )}

      {isFileTooLarge && (
        <div
          className="text-sm text-red-500 flex items-center gap-1"
          style={{
            maxWidth: previewImageSize,
          }}
        >
          <span>Please upload a picture smaller than 2 MB</span>
        </div>
      )}
    </div>
  );
};

interface UploadProgressProps {
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="bg-green-200 flex items-center justify-center h-[28px] px-2 w-full rounded-lg border-primary border">
      <div className="w-full h-[8px] rounded-full overflow-hidden bg-green-100">
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
