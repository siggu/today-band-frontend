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

interface IBand {
  id: number;
  name: string;
  photo: string;
  formation_date: string;
  debut_date: string;
  genre: IGenre[];
  members: string;
  hit_songs: string;
  music_links: string;
  music_photo: string;
  albums: string;
  awards: string;
}

interface IGenre {
  id: number;
  name: string;
}

export default function Home() {
  const { data, isLoading } = useQuery<IBand[]>({
    queryKey: ['bands'],
    queryFn: getBands,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [songs, setSongs] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      const bandForToday = data[getIndexForToday(data.length)];
      setSongs(bandForToday.hit_songs.split(','));
      setImages(bandForToday.music_photo.split(','));
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
  const band_photo = bandForToday.photo.split(',');

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
            <Image h={550} src={band_photo[0]} alt={bandForToday.name} />
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
                <Text>노래 듣기</Text>
              </HStack>
            </DialogTrigger>
            <DialogContent>
              <DialogBody p={0} m={0}>
                <TurnTable songs={songs} images={images} bandName={bandForToday.name} />
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </VStack>
      </HStack>

      {/* 원래 턴테이블 자리 */}
    </Container>
  );
}
