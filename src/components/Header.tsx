import { Button } from './ui/button';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTrigger,
} from './ui/drawer';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from './ui/accordion';
import { HStack, Box, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useColorMode } from './ui/color-mode';
import { MdDarkMode } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { getBands } from '../api';
import useUser from '../lib/useUser';
import LoginDialog from './LoginDialog';
import LogOutDialog from './LogOutDialog';

export default function Header() {
  const { data, isLoading } = useQuery({
    queryKey: ['band'],
    queryFn: getBands,
  });
  const [open, setOpen] = useState(false);

  const { toggleColorMode } = useColorMode(); // 다크모드 토글

  const refreshPage = (url: string) => {
    window.location.href = url;
  };

  const { userLoading, isLoggedIn, user } = useUser();

  const classifications = [
    { code: 'ga', title: '가' },
    { code: 'na', title: '나' },
    { code: 'da', title: '다' },
    { code: 'ra', title: '라' },
    { code: 'ma', title: '마' },
    { code: 'ba', title: '바' },
    { code: 'sa', title: '사' },
    { code: 'ah', title: '아' },
    { code: 'ja', title: '자' },
    { code: 'cha', title: '차' },
    { code: 'ka', title: '카' },
    { code: 'ta', title: '타' },
    { code: 'pa', title: '파' },
    { code: 'ha', title: '하' },
  ];

  return (
    <Box position='relative' padding='30px'>
      <Box position='absolute' left='0' top='50%' transform='translateY(-50%)'>
        <Button mx={2} size={'sm'} onClick={toggleColorMode} rounded={5}>
          <MdDarkMode />
        </Button>
        <Button size={'sm'} onClick={() => refreshPage(`/comments`)}>
          댓글
        </Button>
      </Box>

      <Box textAlign='center' mx='auto' maxW={'200px'}>
        <Box onClick={() => refreshPage(`/`)}>
          <Text _hover={{ cursor: 'pointer' }} fontSize='30px' fontWeight='bold'>
            오늘의 밴드
          </Text>
        </Box>
      </Box>

      <HStack position='absolute' right='0' top='50%' transform='translateY(-50%)'>
        <Box>
          {!userLoading ? (
            !isLoggedIn ? (
              <>
                <LoginDialog />
              </>
            ) : (
              <LogOutDialog />
            )
          ) : null}
        </Box>
        <Box>
          <DrawerRoot size={'md'} open={open} onOpenChange={(e: any) => setOpen(e.open)}>
            <DrawerBackdrop />
            <DrawerTrigger>
              <Button rounded={5}>밴드 목록</Button>
            </DrawerTrigger>
            <DrawerContent rounded='5px'>
              <DrawerHeader fontSize={'18px'}>밴드 목록</DrawerHeader>
              <DrawerBody>
                <AccordionRoot rounded='5px' variant={'enclosed'} size={'lg'} multiple defaultValue={[]}>
                  {classifications.map((cls) => (
                    <AccordionItem key={cls.code} value={cls.code}>
                      <AccordionItemTrigger _hover={{ cursor: 'pointer' }}>{cls.title}</AccordionItemTrigger>
                      <AccordionItemContent>
                        {isLoading ? (
                          <Text>Loading...</Text>
                        ) : (
                          data
                            .filter((band: any) => band.classification === cls.code)
                            .map((band: any) => (
                              <Box key={band.id} marginBottom={4}>
                                <Box _hover={{ cursor: 'pointer' }} onClick={() => refreshPage(`/bands/${band.id}`)}>
                                  <Text fontWeight={'bold'}>{band.name}</Text>
                                </Box>
                              </Box>
                            ))
                        )}
                      </AccordionItemContent>
                    </AccordionItem>
                  ))}
                </AccordionRoot>
              </DrawerBody>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>
        </Box>
      </HStack>
    </Box>
  );
}
