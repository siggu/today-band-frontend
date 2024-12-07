import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Group, HStack, Image, Link, PopoverTrigger, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { LuExternalLink } from 'react-icons/lu';
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from 'react-icons/io5';
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5';
import { IoList } from 'react-icons/io5';
import { AiFillSound } from 'react-icons/ai';
import { getBands } from '../api';
import { Slider } from '../components/ui/slider';
import { PopoverBody, PopoverContent, PopoverFooter, PopoverRoot } from '../components/ui/popover';
import { DialogRoot, DialogTrigger, DialogContent, DialogBody } from '../components/ui/dialog';
import { IoPerson } from 'react-icons/io5';
import { BsMusicNote, BsMusicPlayerFill } from 'react-icons/bs';
import { FaGuitar } from 'react-icons/fa';
import { Button } from '../components/ui/button';

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
  const [currentPage, setCurrentPage] = useState(0);
  const songsPerPage = 5;
  const startIndex = currentPage * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const paginatedSongs = songs.slice(startIndex, endIndex);
  const paginatedImages = images.slice(startIndex, endIndex);

  useEffect(() => {
    if (!isLoading && data) {
      const bandForToday = data[getIndexForToday(data.length)];
      setSongs(bandForToday.hit_songs.split(','));
      setImages(bandForToday.music_photo.split(','));
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
      audio.play().catch((error) => console.error('Error playing audio:', error));
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

  const onVolumeChange = (value: any) => {
    if (audio) {
      audio.volume = value / 100;
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * songsPerPage < songs.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

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
                <VStack p={20} maxW={'700px'} position={'relative'}>
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
                  <Text
                    color={'white'}
                    style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}
                    mb={10}
                    fontSize={20}
                  >
                    {songs[currentSongIndex]}
                  </Text>

                  {/* 재생 컨트롤 */}
                  <Box color={'white'}>
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
                            {paginatedSongs.map((element, index) => {
                              const songIndex = startIndex + index; // 실제 곡 인덱스
                              return (
                                <HStack
                                  key={index}
                                  p={2}
                                  _hover={{
                                    backgroundColor: { base: 'gray.200', _dark: 'gray.800' },
                                    borderRadius: 'md',
                                  }}
                                  textStyle={'md'}
                                  onClick={() => selectSong(songIndex)}
                                >
                                  <Image rounded={5} w={45} src={paginatedImages[index]} />
                                  {songIndex === currentSongIndex && isPlaying && (
                                    <Box color={'#4882D9'} ml={3.5} position={'absolute'}>
                                      <BsMusicNote />
                                    </Box>
                                  )}
                                  <VStack gap={0} alignItems={'flex-start'}>
                                    <HStack>
                                      {songIndex === currentSongIndex && isPlaying ? (
                                        <Text color={'#4882D9'}>{element}</Text>
                                      ) : (
                                        <Text>{element}</Text>
                                      )}
                                    </HStack>
                                    <Text color={'gray.600'} fontSize={11}>
                                      {bandForToday.name}
                                    </Text>
                                  </VStack>
                                </HStack>
                              );
                            })}
                          </PopoverBody>

                          <PopoverFooter>
                            <Group justifyContent={'space-between'}>
                              <Button size='sm' onClick={handlePrevPage} disabled={currentPage === 0}>
                                이전
                              </Button>
                              <Button
                                size='sm'
                                onClick={handleNextPage}
                                disabled={(currentPage + 1) * songsPerPage >= songs.length}
                              >
                                다음
                              </Button>
                            </Group>
                          </PopoverFooter>
                        </PopoverContent>
                      </PopoverRoot>
                    </HStack>
                  </Box>
                </VStack>
              </DialogBody>
            </DialogContent>
          </DialogRoot>
        </VStack>
      </HStack>

      {/* 원래 턴테이블 자리 */}
    </Container>
  );
}
