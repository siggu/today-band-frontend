import { HStack, VStack, Box, Text, Image, Container, Icon } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBand, getLikes, postLikes } from '../api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TurnTable } from '../components/TurnTable';
import { IBand } from '@/types';
import { FaRegStar, FaStar } from 'react-icons/fa';

export default function Band() {
  const { bandId } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<IBand>({
    queryKey: [`${bandId}`],
    queryFn: getBand,
  });

  const { data: likeData, isLoading: isLikeDataLoading } = useQuery({
    queryKey: ['like'],
    queryFn: getLikes,
  });

  const isLiked = bandId && likeData ? likeData.some((like: { id: number }) => like.id === parseInt(bandId)) : false;

  const [songs, setSongs] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const members = data?.members.split(',');
  const members_photos = data?.member_photos.split(',');
  const member_info = data?.member_info.split('/');
  const band_photo = data?.photo ? data.photo.split(',') : [];

  const mutation = useMutation({
    mutationFn: postLikes,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['like'],
        exact: true,
      });
    },
  });

  const handleLike = () => {
    if (bandId) {
      mutation.mutate(bandId!);
    } else {
      console.log('band ID undefined임');
    }
  };

  const refreshPage = (url: string) => {
    window.location.href = url;
  };

  useEffect(() => {
    if (!isLoading && data) {
      setSongs(data.hit_songs.split(','));
    }
  }, [data, isLoading]);

  return (
    <Container pt={50}>
      <HStack gap={10} display={'flex'} wrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
        <VStack m={10} mb={20} gap={3} alignItems={'flex-start'} w={450} wrap={'wrap'}>
          <HStack>
            <Text fontWeight={'black'} color={'#4882D9'} fontSize={30}>
              {data?.name}
            </Text>
            <Box onClick={handleLike}>
              {isLiked ? (
                <Box onClick={() => refreshPage(`/bands/${bandId}`)}>
                  <FaStar size={20} />
                </Box>
              ) : (
                <Box onClick={() => refreshPage(`/bands/${bandId}`)}>
                  <FaRegStar size={20} />
                </Box>
              )}
            </Box>
          </HStack>
          <Box>
            <Image src={band_photo[1]} alt={data?.name}></Image>
          </Box>
          <Box p={5} layerStyle={'fill.surface'}>
            <Text fontWeight={'extrabold'}>{data?.introduction}</Text>
          </Box>
          {data?.formation_date === '-' ? null : (
            <HStack>
              <Text>결성일:</Text>
              <Text>{data?.formation_date}</Text>
            </HStack>
          )}
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
            {members?.map((member, index) =>
              index + 1 < members.length ? <Text key={index}>{member}, </Text> : <Text key={index}>{member}</Text>
            )}
          </HStack>
          <HStack textWrap={'wrap'}>
            <Text whiteSpace='nowrap'>수상:</Text>
            <Text>{data?.awards}</Text>
          </HStack>
        </VStack>
        <Box m={10}>
          <TurnTable songs={songs} bandName={data?.name} />
        </Box>
      </HStack>
      <Box mt={20} mx={10}>
        <Text color={'#4882D9'} fontWeight={'extrabold'} fontSize={22}>
          멤버
        </Text>
      </Box>
      <HStack wrap={'wrap'} m={10} mt={5} justifyContent={'space-between'} alignItems={'start'}>
        {members_photos?.map((photo, index) => (
          <Box w={250}>
            <Image rounded={5} src={photo} />
            <Text fontWeight={'bold'} py={2}>
              {members![index]}
            </Text>
            <Text>{member_info![index]}</Text>
          </Box>
        ))}
      </HStack>
    </Container>
  );
}
