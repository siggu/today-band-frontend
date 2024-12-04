import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getBands } from '../api';
import { useQuery } from '@tanstack/react-query';

interface IBand {
  name: string;
  photo: string;
  formation_date: string;
  debut_date: string;
  genre: IGenre[];
  members: string;
  hit_songs: string;
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

  return (
    <HStack p={30} gap={5}>
      {data?.map((band) => (
        <VStack alignItems={'flex-start'} w={600} wrap={'wrap'}>
          <Text fontSize={20}>{band?.name}</Text>
          <Box>
            <Image h={400} src={`${band.photo}`}></Image>
          </Box>
          <HStack>
            <Text>결성일:</Text>
            <Text>{band.formation_date}</Text>
          </HStack>
          <HStack>
            <Text>데뷔일:</Text>
            <Text>{band.debut_date}</Text>
          </HStack>
          <HStack wrap={'wrap'}>
            <Text>장르:</Text>
            {band.genre.map((genre, index) =>
              index + 1 < band.genre.length ? <Text>{genre?.name}, </Text> : <Text>{genre?.name}</Text>
            )}
          </HStack>
          <HStack>
            <Text>멤버:</Text>
            <Text>{band.members}</Text>
          </HStack>
          <HStack>
            <Text>대표곡:</Text>
            <Text>{band.hit_songs}</Text>
          </HStack>
          <HStack>
            <Text>앨범:</Text>
            <Text>{band.albums}</Text>
          </HStack>
          <HStack>
            <Text>수상:</Text>
            <Text>{band.awards}</Text>
          </HStack>
        </VStack>
      ))}
    </HStack>
  );
}
