import { User } from '@/lib/types';
import { ApiError, axios } from '@/lib/axios';
import { toast } from '@/components/common/toaster';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useUserState } from '../store/account';

async function fetchSystemSettings(): Promise<Record<string, any>> {
  const res = await axios.get(`/settings`);
  return res.data.data;
}

export const useGetSetting = () => {
  return useQuery({
    queryFn: async () => {
      const response = await fetchSystemSettings();
      return response;
    },
    queryKey: [`get-system-setting`],
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.message || 'An error occurred');
    },
    onSuccess: (data) => {
      return data;
    },
  });
};
