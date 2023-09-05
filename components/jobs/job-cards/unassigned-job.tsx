'use client';
import { Button } from 'pakt-ui';
import { useRouter } from 'next/navigation';

interface UnAssignedJobCardProps {
  title: string;
  price: number;
  createdAt: string;
}

export const UnAssignedJob: React.FC<UnAssignedJobCardProps> = ({ createdAt, price, title }) => {
  const router = useRouter();

  return (
    <div className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            {<span className="text-body text-lg">{createdAt}</span>}

            <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
          </div>
          <div className="grow text-title text-2xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          <Button
            size="xs"
            variant="secondary"
            onClick={() => {
              router.push('/talents');
            }}
          >
            Find Talent
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push('/jobs/123');
            }}
          >
            Job Details
          </Button>
        </div>
      </div>
    </div>
  );
};