'use client';
import Image from 'next/image';
import { Button } from 'pakt-ui';
import { format } from 'date-fns';
import { type Job } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { isJobApplicant } from '@/lib/types';

interface UnAssignedJobCardProps {
  job: Job;
}

export const UnAssignedJobCard: React.FC<UnAssignedJobCardProps> = ({ job }) => {
  const router = useRouter();

  const { createdAt, _id, collections, tagsData, name, paymentFee, invite, isPrivate } = job;

  const id = _id;
  const title = name;
  const skills = tagsData.join(',');
  const applicants = collections.filter(isJobApplicant);
  const hasInvite = invite !== undefined && invite !== null;
  const creationDate = format(new Date(createdAt), 'dd MMM yyyy');

  return (
    <div className="gap-4 bg-white rounded-3xl border-line w-full flex flex-col grow border p-4">
      <div className="w-full flex gap-4">
        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">{<span className="text-body text-lg">{creationDate}</span>}</div>

            <span className="px-3 text-lg border border-green-200 text-title inline-flex rounded-full bg-[#B2E9AA66]">
              ${paymentFee}
            </span>
          </div>
          <div className="grow text-title text-2xl min-h-[58px] break-words">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="gap-2 flex items-center">
          {!hasInvite && isPrivate && (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                router.push(`/talents${skills ? `?skills=${skills}` : ''}`);
              }}
            >
              Find Talent
            </Button>
          )}

          {!hasInvite && !isPrivate && (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                router.push(`/jobs/${id}/applicants`);
              }}
            >
              View Applicants
            </Button>
          )}

          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              router.push(`/jobs/${id}`);
            }}
          >
            Job Details
          </Button>
        </div>

        <div>
          {!isPrivate && !hasInvite && (
            <div className="inline-flex items-center flex-row-reverse w-fit">
              {applicants.length > 5 && (
                <div className="text-sm flex items-center justify-center overflow-hidden h-[30px] w-[30px] bg-[#D9D9D9] border-2 border-white rounded-full -ml-3 last:ml-0">
                  <span className="-ml-1.5">+{applicants.length - 5}</span>
                </div>
              )}

              {applicants.slice(0, 5).map((applicant, index) => {
                return (
                  <div
                    key={index}
                    className="h-[30px] w-[30px] overflow-hidden bg-green-100 border-2 border-white rounded-full -ml-3 last:ml-0"
                  >
                    {applicant.creator.profileImage && (
                      <Image src={applicant.creator.profileImage?.url ?? ''} alt="" width={30} height={30} />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {hasInvite && (
            <div className="px-1 pr-3 py-0.5 text-[#0065D0] text-sm inline-flex items-center gap-1 rounded-full bg-[#C9F0FF] border border-[#48A7F8]">
              <div className="h-[27px] w-[27px] bg-white border border-white rounded-full overflow-hidden">
                {invite?.receiver.profileImage && (
                  <Image src={invite.receiver.profileImage?.url ?? ''} alt="" width={30} height={30} />
                )}
              </div>
              <span>Awaiting Talent Response</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
