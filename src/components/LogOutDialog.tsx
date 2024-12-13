import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Toaster, toaster } from './ui/toaster';
import { logOut } from '../api';

export default function LogOutDialog() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: logOut,
    onMutate: () => {
      const promise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      toaster.promise(promise, {
        success: {
          title: '로그아웃 완료',
        },
        error: {
          title: '로그아웃 실패',
        },
        loading: {
          title: '로그아웃 중....',
        },
      });
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['me'],
        exact: true,
      });
    },
  });

  const handleLogoutSubmit = async () => {
    mutation.mutate();
  };

  return (
    <>
      <Toaster />
      <Button onClick={handleLogoutSubmit}>로그아웃</Button>
    </>
  );
}
