'use client';
import React from 'react';
import Link from 'next/link';
import { Bookmark, X } from 'lucide-react';
import { UserAvatar } from '@/components/common/user-avatar';

interface OpenJobProps {
  id: string;
  title: string;
  price: number;
  creator: {
    name: string;
    avatar?: string;
    paktScore: number;
  };
  skills: string[];
}

export const OpenJobCard: React.FC<OpenJobProps> = ({ creator, price, skills, title, id }) => {
  return (
    <Link
      href={`/jobs/${id}`}
      className="gap-4 max-w-2xl bg-white rounded-3xl border-line w-full flex flex-col grow border p-4"
    >
      <div className="w-full flex gap-4">
        {<UserAvatar score={creator.paktScore} size="sm" />}

        <div className="flex flex-col gap-2 grow">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-body text-base font-medium">{creator.name}</span>
              <span className="px-3 text-base text-title inline-flex rounded-full bg-[#B2E9AA66]">${price}</span>
            </div>

            <X size={20} />
          </div>
          <div className="grow text-title text-xl">{title}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between mt-auto">
        <div className="flex items-end gap-2 flex-wrap max-w-full">
          {skills.map((skill) => (
            <span key={skill} className="px-4 capitalize rounded-full py-0.5 bg-slate-100 whitespace-nowrap">
              {skill}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2">
          <Bookmark size={20} />
          <span>Bookmark</span>
        </button>
      </div>
    </Link>
  );
};
