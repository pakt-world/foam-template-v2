'use client';

import React, { useEffect, useMemo } from 'react';
import { useGetTalentReviewById } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Achievements } from '@/components/talents/achievement';
import { Reviews } from '@/components/talents/review';
import { useUserState } from '@/lib/store/account';
import { ProfileHeader } from '@/components/talents/header';
import { Bio } from '@/components/talents/bio';
import { PageLoading } from '@/components/common/page-loading';

export default function Profile() {
  const router = useRouter();
  const user = useUserState();
  const talentId = String(user?._id);
  const { data: talentReviews, isLoading, refetch: FetchTalent } = useGetTalentReviewById(talentId, '1', '10', true);

  useEffect(() => {
    if (talentId) {
      FetchTalent();
    } else router.back();
  }, [user]);

  const talent = useMemo(
    () => ({
      id: user?._id,
      name: `${user?.firstName} ${user?.lastName}`,
      position: user?.profile?.bio?.title || '',
      image: user?.profileImage?.url || '',
      bio: user?.profile?.bio?.description || '',
      score: user?.score || 0,
      achievements: (user?.achievements || []).map((a) => ({
        title: a.type,
        type: a.type,
        total: Number(a.total),
        value: Number(a.value),
      })),
      skills: (user?.profile?.talent?.tagsIds || []).map((t) => ({ name: t.name, backgroundColor: t.color })) || [],
    }),
    [user],
  );
  if (isLoading) return <PageLoading />;
  const reviews = talentReviews?.data || [];
  return (
    <div className="grid gap-6 grid-cols-1 pb-4 h-fit items-start overflow-y-auto">
      <ProfileHeader
        _id={talent.id}
        name={talent.name}
        position={talent.position}
        score={talent.score}
        skills={talent.skills}
        isOwnProfile={true}
        profileImage={talent.image}
      />

      <div className="flex gap-6 w-full">
        <Bio body={talent.bio} />
        <Achievements
          achievements={talent.achievements?.map(({ total, type, value }) => ({
            type,
            title: type,
            total: Number(total),
            value: parseInt(String(value)),
          }))}
        />
      </div>
      <div className="w-full">
        <Reviews
          reviews={
            reviews?.map((a) => ({
              title: a.data.name,
              body: a.review,
              rating: a.rating,
              user: {
                _id: a.owner._id,
                afroScore: a.owner.score,
                name: `${a.owner.firstName}${a.owner.lastName}`,
                title: a.owner.profile.bio?.title || '',
                avatar: a.owner.profileImage?.url ?? '',
              },
            })) ?? []
          }
          loading={isLoading}
        />
      </div>
    </div>
  );
}
