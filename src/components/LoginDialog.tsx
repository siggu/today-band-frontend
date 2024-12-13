import { Box, defineStyle, Field, Input, Text, VStack } from '@chakra-ui/react';
import { DialogBody, DialogContent, DialogRoot, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { usernameLogIn } from '../api';
import { IUsernameLoginVariables } from '../types';
import { Toaster, toaster } from './ui/toaster';
import useUser from '../lib/useUser';

const floatingStyles = defineStyle({
  pos: 'absolute',
  bg: 'bg',
  px: '0.5',
  top: '-3',
  insetStart: '2',
  fontWeight: 'normal',
  pointerEvents: 'none',
  transition: 'position',
  _peerPlaceholderShown: {
    color: 'fg.muted',
    top: '2.5',
    insetStart: '3',
  },
  _peerFocusVisible: {
    color: 'fg',
    top: '-3',
    insetStart: '2',
  },
});

export default function LoginDialog() {
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const mutation = useMutation({
    mutationFn: ({ username, password }: IUsernameLoginVariables) => usernameLogIn({ username, password }),
    onMutate: () => {
      const promise = new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
      toaster.promise(promise, {
        success: {
          title: '로그인 완료',
        },
        error: {
          title: '로그인 실패',
        },
        loading: {
          title: '로그인 중....',
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

  const handleLoginSubmit = () => {
    if (!username.trim() || !password) {
      toaster.create({
        title: '아이디와 비밀번호를 모두 입력해야 합니다.',
        type: 'error',
        duration: 1000,
      });
      return;
    }
    mutation.mutate({ username: username, password: password });
  };

  return (
    <DialogRoot>
      <Toaster />
      <DialogTrigger>
        <Button>로그인</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogBody as={'form'} p={8}>
          <VStack mb={5} alignItems={'flex-start'}>
            <Field.Root>
              <Text mb={5} fontSize={18} fontWeight={'black'} color={'#4882D9'}>
                로그인
              </Text>
              <Box mb={1} pos={'relative'} w={'full'}>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  name='username'
                  className='peer'
                  placeholder=''
                />
                <Field.Label css={floatingStyles}>아이디</Field.Label>
              </Box>
            </Field.Root>
            <Field.Root>
              <Box pos={'relative'} w={'full'}>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type='password'
                  name='password'
                  className='peer'
                  placeholder=''
                />
                <Field.Label css={floatingStyles}>비밀번호</Field.Label>
              </Box>
            </Field.Root>
          </VStack>
          <Box typeof='submit' display={'flex'} justifyContent={'flex-end'}>
            <Button onClick={handleLoginSubmit}>로그인</Button>
          </Box>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
}
