import React, { useState, useEffect } from 'react';
import { Box, Container, HStack, Image, Link, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { LuExternalLink } from 'react-icons/lu';
import { getBands } from '../api';
import { DialogRoot, DialogTrigger, DialogContent, DialogBody } from '../components/ui/dialog';
import { IoPerson } from 'react-icons/io5';
import { BsMusicPlayerFill } from 'react-icons/bs';
import { FaGuitar } from 'react-icons/fa';
import { TurnTable } from '../components/TurnTable';
import { IBand } from '@/types';

export default function Home() {
  const { data, isLoading } = useQuery<IBand[]>({
    queryKey: ['bands'],
    queryFn: getBands,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [songs, setSongs] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      const bandForToday = data[getIndexForToday(data.length)];
      setSongs(bandForToday.hit_songs.split(','));
    }
  }, [data, isLoading]);

  const getIndexForToday = (max: number) => {
    const today = new Date().toISOString().split('T')[0];
    const hash = Array.from(today).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % max;
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data || data.length === 0) {
    return <Text>No data available</Text>;
  }

  const bandForToday = data[getIndexForToday(data.length)];

  return (
    <Container
      maxW={'max-content'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <HStack gap={10} mt={20} mb={10} flexWrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
        <VStack justifyContent={'center'} p={30}>
          <Box>
            <Image
              h={550}
              src={`https://today-band.s3.ap-northeast-2.amazonaws.com/${bandForToday.name}/images/${bandForToday.name}_1.jpg`}
            />
          </Box>
        </VStack>
        <VStack gap={5} justifyContent={'center'} alignItems={'flex-start'} p={30}>
          <HStack mb={5}>
            <Link href={`bands/${bandForToday.id}`}>
              <HStack py={2}>
                <Text fontWeight={'black'} color={'#4882D9'} fontSize={25}>{`${bandForToday.name}`}</Text>
                <LuExternalLink />
              </HStack>
            </Link>
          </HStack>

          <HStack wrap={'wrap'}>
            <FaGuitar size={'22'} />
            {bandForToday.genre.map((genre, index) =>
              index + 1 < bandForToday.genre.length ? (
                <Text key={genre.id}>{genre.name}, </Text>
              ) : (
                <Text key={genre.id}>{genre.name}</Text>
              )
            )}
          </HStack>
          <HStack>
            <IoPerson size={'20'} />
            <Text>{bandForToday.members}</Text>
          </HStack>
          <DialogRoot
            onExitComplete={() => {
              if (audio) {
                audio.pause();
                setIsPlaying(false);
              }
            }}
            placement={'center'}
            size='lg'
            motionPreset='slide-in-bottom'
          >
            <DialogTrigger>
              <HStack>
                <BsMusicPlayerFill size={'20'} />
                <Text _hover={{ cursor: 'pointer' }}>노래 듣기</Text>
              </HStack>
            </DialogTrigger>
            <DialogContent>
              <DialogBody p={0} m={0}>
                <TurnTable songs={songs} bandName={bandForToday.name} />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </VStack>
      </HStack>
    </Container>
  );
}
