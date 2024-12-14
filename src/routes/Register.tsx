import { userRegister } from '../api';
import { Box, Button, Container, defineStyle, Field, Input, Text, VStack } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster, toaster } from './../components/ui/toaster';
import { IUsernameLoginVariables } from './../types.d';

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

export default function Register() {
  const refreshPage = (url: string) => {
    window.location.href = url;
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: ({ username, password }: IUsernameLoginVariables) => userRegister({ username, password }),
    onMutate: () => {
      toaster.create({
        title: '회원가입 중...',
        type: 'loading',
        id: 'register',
        duration: 1000,
      });
      toaster.dismiss();
    },
    onSuccess: () => {
      refreshPage('/');
    },
    onError: (error) => {
      toaster.create({
        title: `${error.message} 오류 발생`,
        type: 'error',
        duration: 1000,
      });
    },
  });

  const handleUserRegister = async () => {
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
    <Container mt={50} maxW={'md'}>
      <Toaster />
      <VStack mb={5} alignItems={'flex-start'}>
        <Field.Root>
          <Text mb={5} fontSize={18} fontWeight={'black'} color={'#4882D9'}>
            회원가입
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
        <Button onClick={handleUserRegister}>회원가입</Button>
      </Box>
    </Container>
  );
}
