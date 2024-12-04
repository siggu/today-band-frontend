import { HStack, VStack, Box, Text, Image } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getBand } from '../api';
import { useParams } from 'react-router-dom';

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

export default function Band() {
  const { bandId } = useParams();
  const { data, isLoading } = useQuery<IBand>({
    queryKey: [`${bandId}`],
    queryFn: getBand,
  });

  return (
    <HStack p={30} gap={5}>
      <VStack alignItems={'flex-start'} w={600} wrap={'wrap'}>
        <Text fontSize={20}>{data?.name}</Text>
        <Box>
          <Image h={400} src={`${data?.photo}`}></Image>
        </Box>
        <HStack>
          <Text>결성일:</Text>
          <Text>{data?.formation_date}</Text>
        </HStack>
        <HStack>
          <Text>데뷔일:</Text>
          <Text>{data?.debut_date}</Text>
        </HStack>
        <HStack wrap={'wrap'}>
          <Text>장르:</Text>
          {data?.genre.map((genre, index) =>
            index + 1 < data?.genre.length ? <Text>{genre?.name}, </Text> : <Text>{genre?.name}</Text>
          )}
        </HStack>
        <HStack>
          <Text>멤버:</Text>
          <Text>{data?.members}</Text>
        </HStack>
        <HStack>
          <Text>대표곡:</Text>
          <Text>{data?.hit_songs}</Text>
        </HStack>
        <HStack>
          <Text>앨범:</Text>
          <Text>{data?.albums}</Text>
        </HStack>
        <HStack>
          <Text>수상:</Text>
          <Text>{data?.awards}</Text>
        </HStack>
      </VStack>
    </HStack>
  );
}
