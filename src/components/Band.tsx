import { HStack, VStack, Box, Text, Image, Container, Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { getBand } from '../api';
import { useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from './ui/popover';
import { AiFillSound } from 'react-icons/ai';
import { Slider } from './ui/slider';
import { IoList, IoPauseSharp, IoPlaySharp, IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from 'react-icons/io5';

interface IBand {
  name: string;
  photo: string;
  formation_date: string;
  debut_date: string;
  genre: IGenre[];
  members: string;
  member_photos: string;
  member_info: string;
  hit_songs: string;
  music_photo: string;
  introduction: string;
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

  const initialVolume = [50];
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [songs, setSongs] = useState<string[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [isImageChanging, setIsImageChanging] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [volume, setVolume] = useState(initialVolume);
  const rotationInterval = useRef<NodeJS.Timeout | null>(null);
  const members = data?.members.split(',');
  const members_photos = data?.member_photos.split(',');
  const member_info = data?.member_info.split('/');

  useEffect(() => {
    if (!isLoading && data) {
      setSongs(data.hit_songs.split(','));
      setImages(data.music_photo.split(','));
    }
  }, [data, isLoading]);

  const initializeAudio = (songName: string) => {
    if (audio) {
      audio.pause();
      audio.src = `/songs/${songName}.mp3`;
      audio.load();
    } else {
      const newAudio = new Audio(`/songs/${songName}.mp3`);
      setAudio(newAudio);
    }
  };

  const playAudio = () => {
    if (audio) {
      audio.play().catch((error) => console.error('음악 재생 중 오류 발생', error));
    }
  };

  const togglePlay = async () => {
    if (!audio && songs[currentSongIndex]?.trim()) {
      initializeAudio(songs[currentSongIndex].trim());
    }

    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const skipBack = () => {
    setIsImageChanging(true);
    setTimeout(() => {
      setSlideDirection('left');
      const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(newIndex);
      setIsImageChanging(false);
    }, 0);

    if (audio) {
      const songName = songs[currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1]?.trim();
      initializeAudio(songName);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  const skipForward = () => {
    setIsImageChanging(true);
    setTimeout(() => {
      setSlideDirection('right');
      const newIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
      setCurrentSongIndex(newIndex);
      setIsImageChanging(false);
    }, 0);

    if (audio) {
      const songName = songs[currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1]?.trim();
      initializeAudio(songName);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error('Error playing audio:', error));
    }
  };

  const selectSong = (index: number) => {
    setCurrentSongIndex(index);
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        playAudio();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const songName = songs[currentSongIndex]?.trim();
    if (songName) {
      initializeAudio(songName);
      if (isPlaying) {
        playAudio();
      }
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset audio to the beginning
      }
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (isPlaying && audio) {
      rotationInterval.current = setInterval(() => {
        setRotation((prevRotation) => prevRotation + 1);
      }, 40);
    } else if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
    }

    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, [isPlaying, audio]);

  useEffect(() => {
    if (audio) {
      const handleSongEnd = () => {
        skipForward();
      };
      audio.addEventListener('ended', handleSongEnd);

      return () => {
        audio.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [audio, skipForward]);

  const onVolumeChange = (value: any) => {
    if (audio) {
      audio.volume = value / 100;
      console.log(audio.volume);
    }
  };

  return (
    <Container pt={50}>
      <HStack display={'flex'} wrap={'wrap'} justifyContent={'space-around'} alignItems={'center'}>
        <VStack m={10} gap={3} alignItems={'flex-start'} w={500} wrap={'wrap'}>
          <Text fontSize={30}>{data?.name}</Text>
          <Box>
            <Image src={`${data?.photo}`}></Image>
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
        <VStack p={12} m={5} position={'relative'}>
          {/* 블러 처리된 배경 이미지 */}
          <Box
            position='absolute'
            top={0}
            left={0}
            width='100%'
            height='100%'
            backgroundImage={`linear-gradient(rgba(128, 128, 128, 0.1), rgba(128, 128, 128, 0.5)), url(${images[
              currentSongIndex
            ]?.trim()})`}
            backgroundSize='cover'
            backgroundPosition='center'
            filter='blur(10px)'
            zIndex={-1}
          />

          {/* 턴 테이블 */}
          <Box position='relative' w={300} h={300} mb={10} overflow='hidden'>
            {images.map((image, index) => (
              <Image
                key={index}
                src={image.trim()}
                alt={`Song ${index}`}
                position='absolute'
                top={0}
                left={0}
                w='100%'
                h='100%'
                objectFit='cover'
                borderRadius='50%'
                style={{
                  transform: `
          translateX(${index === currentSongIndex ? 0 : slideDirection === 'left' ? '30%' : '-30%'})
          rotate(${index === currentSongIndex ? rotation : 20}deg)`,
                  opacity: index === currentSongIndex ? 1 : 0,
                  zIndex: index === currentSongIndex ? 2 : 1,
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                }}
              />
            ))}
          </Box>

          {/* 노래 제목 */}
          <Box>
            <Text
              color={'white'}
              style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
              mb={10}
              fontSize={20}
            >
              {songs[currentSongIndex]}
            </Text>
          </Box>

          {/* 재생 컨트롤 */}
          <Box color={'white'} p={3}>
            <HStack gap={28}>
              <PopoverRoot unstyled positioning={{ placement: 'top' }}>
                <PopoverTrigger>
                  <AiFillSound style={{ marginTop: '3px' }} />
                </PopoverTrigger>
                <PopoverContent zIndex={1500}>
                  <PopoverBody>
                    <Slider
                      height={'100px'}
                      orientation={'vertical'}
                      value={volume}
                      onValueChange={(e) => onVolumeChange(e.value)}
                    />
                  </PopoverBody>
                </PopoverContent>
              </PopoverRoot>
              <IoPlaySkipBackSharp style={{ marginTop: '4px' }} onClick={skipBack} />
              <Box zIndex={0} onClick={togglePlay} mt={1}>
                {isPlaying ? <IoPauseSharp /> : <IoPlaySharp />}
              </Box>
              <IoPlaySkipForwardSharp style={{ marginTop: '4px' }} onClick={skipForward} />
              <PopoverRoot modal={true} positioning={{ placement: 'right-end' }}>
                <PopoverTrigger>
                  <IoList style={{ marginTop: '4px' }} />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <Text fontWeight={'bold'} mb={3} fontSize={'17px'}>
                      노래 리스트
                    </Text>
                    {songs?.map((element, index) => (
                      <Box
                        p={2}
                        _hover={{ backgroundColor: { base: 'gray.200', _dark: 'gray.800' } }}
                        textStyle={'md'}
                        onClick={() => selectSong(index)}
                      >
                        <Text>
                          {index + 1}. {element}
                        </Text>
                      </Box>
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </PopoverRoot>
            </HStack>
          </Box>
        </VStack>
      </HStack>
      <Box mx={10}>
        <Text fontWeight={'extrabold'} fontSize={22}>
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
