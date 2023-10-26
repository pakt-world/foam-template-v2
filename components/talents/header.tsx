'use client';

import React from 'react';
import { Button } from 'pakt-ui';
import { Briefcase, Edit } from 'lucide-react';
import { getAvatarColor } from '@/lib/utils';
import Link from 'next/link';
import { InviteTalentModal } from '@/components/talents/invite-talent';
import { AfroProfile } from '@/components/common/afro-profile';

interface Props {
  _id: string;
  name: string;
  position: string;
  score: number;
  skills: any[];
  profileImage?: string;
  isOwnProfile?: boolean;
}

export const ProfileHeader: React.FC<Props> = ({ _id, name, position, score, skills, isOwnProfile, profileImage }) => {
  const borderColor = getAvatarColor(score);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <React.Fragment>
      <InviteTalentModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} talentId={_id} />

      <div className="w-full flex bg-white rounded-2xl gap-6 border border-line pr-4 relative">
        <div className="absolute w-full top-1/2 h-[2px]" style={{ backgroundColor: borderColor }}></div>

        <div>
          <AfroProfile src={profileImage} score={score} size="xl" />
        </div>
        <div className="grid grid-cols-1 grow">
          <div className={`flex flex-row gap-2 w-full justify-between`}>
            <div className="flex flex-row justify-between w-full flex-wrap gap-2 items-center">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-title truncate">{name}</h1>
                <div className="flex gap-2 items-center text-body capitalize">
                  <Briefcase size={16} />
                  <span>{position}</span>
                </div>
              </div>

              {!isOwnProfile ? (
                <div className="flex gap-3 items-center max-w-[300px] w-full">
                  <Link href={`/messages?userId=${_id}`}>
                    <Button fullWidth variant="secondary" size={'sm'}>
                      Message
                    </Button>
                  </Link>
                  <Button fullWidth variant="primary" size={'sm'} onClick={() => setIsModalOpen(true)}>
                    Invite to Job
                  </Button>
                </div>
              ) : (
                <div className="flex flex-row justify-end items-center max-w-[300px] ml-auto w-full">
                  <Link href={`/settings`}>
                    <Button fullWidth variant="secondary">
                      <span className="flex flex-row gap-2">
                        <Edit size={24} />
                        Edit Profile
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 h-fit pt-4">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-white rounded-full px-6 py-1.5 text-sm font-medium text-[#090A0A] capitalize"
                style={{
                  backgroundColor: skill.backgroundColor,
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
