import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Toaster, toaster } from './ui/toaster';
import { getLikes, logOut } from '../api';
import { FaStar } from 'react-icons/fa';
import { Box, HStack, Text } from '@chakra-ui/react';
import { PopoverContent, PopoverRoot, PopoverTrigger } from './ui/popover';
import { Link } from 'react-router-dom';

export default function LogOutDialog() {
  const { data, isLoading } = useQuery({
    queryKey: ['like'],
    queryFn: getLikes,
  });

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
      <HStack gap={4}>
        <Toaster />
        <PopoverRoot>
          <PopoverTrigger>
            <Box _hover={{ cursor: 'pointer' }}>
              <FaStar />
            </Box>
          </PopoverTrigger>
          <PopoverContent p={3}>
            {data?.map((band: any) => (
              <Link to={`/bands/${band.id}`}>
                <HStack p={1} justifyContent={'flex-start'} alignItems={'center'}>
                  <FaStar color='#4882D9' />
                  <Text fontWeight={'bold'}>{band.name}</Text>
                </HStack>
              </Link>
            ))}
          </PopoverContent>
        </PopoverRoot>

        <Button onClick={handleLogoutSubmit}>로그아웃</Button>
      </HStack>
    </>
  );
}
