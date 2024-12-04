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
import { HStack, Box, Text } from '@chakra-ui/react'; // Chakra UI 요소
import { useState } from 'react';
import { useColorMode } from './ui/color-mode';
import { MdDarkMode } from 'react-icons/md';

export default function Header() {
  const [open, setOpen] = useState(false);

  const bands = [
    { value: '1', title: '가', text: '가밴드' },
    { value: '2', title: '나', text: '나밴드' },
    { value: '3', title: '다', text: '다밴드' },
  ];

  const { toggleColorMode } = useColorMode(); // 다크모드 토글

  return (
    <HStack justifyContent='space-between' padding='30px' alignItems='center'>
      <Button size={'sm'} onClick={toggleColorMode} rounded={5}>
        <MdDarkMode />
      </Button>

      <Box flex='1' textAlign='center'>
        <Text fontSize='30px' fontWeight='bold'>
          오늘의 밴드
        </Text>
      </Box>

      <Box justifyContent={'center'} alignItems={'center'}>
        <DrawerRoot size={'md'} open={open} onOpenChange={(e: any) => setOpen(e.open)}>
          <DrawerBackdrop />
          <DrawerTrigger>
            <Button rounded={5}>밴드 목록</Button>
          </DrawerTrigger>
          <DrawerContent rounded='5px' offset={4}>
            <DrawerHeader fontSize={'18px'}>밴드 목록</DrawerHeader>
            <DrawerBody>
              <AccordionRoot rounded='5px' variant={'enclosed'} size={'lg'} multiple defaultValue={['1']}>
                {bands.map((band, index) => (
                  <AccordionItem key={index} value={band.value}>
                    <AccordionItemTrigger>{band.title}</AccordionItemTrigger>
                    <AccordionItemContent>{band.text}</AccordionItemContent>
                  </AccordionItem>
                ))}
              </AccordionRoot>
            </DrawerBody>
            <DrawerCloseTrigger />
          </DrawerContent>
        </DrawerRoot>
      </Box>
    </HStack>
  );
}
