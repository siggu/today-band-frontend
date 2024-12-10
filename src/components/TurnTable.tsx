import React, { useState, useEffect, useRef } from 'react';
import { VStack, Box, Text, HStack, Image, Group } from '@chakra-ui/react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { PopoverBody, PopoverContent, PopoverFooter, PopoverRoot, PopoverTrigger } from './ui/popover';
import { BsMusicNote } from 'react-icons/bs';
import { AiFillSound } from 'react-icons/ai';
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp, IoPauseSharp, IoPlaySharp, IoList } from 'react-icons/io5';

interface TurnTableProps {
  songs: string[];
  images: string[];
  bandName: string | undefined;
}

export function TurnTable({ songs, images, bandName }: TurnTableProps) {
  const initialVolume = [50];
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [volume, setVolume] = useState(initialVolume);
  const [currentPage, setCurrentPage] = useState(0);
  const songsPerPage = 5;
  const startIndex = currentPage * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const paginatedSongs = songs.slice(startIndex, endIndex);
  const paginatedImages = images.slice(startIndex, endIndex);
  const rotationInterval = useRef<NodeJS.Timeout | null>(null);

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
    const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const skipForward = () => {
    const newIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
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
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * songsPerPage < songs.length) setCurrentPage(currentPage + 1);
  };

  return (
    <VStack p={20} position={'relative'}>
      {/* 배경 이미지 */}
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
      <Box
        position={'relative'}
        zIndex={1}
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        {/* 턴테이블 */}
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
          <Text color={'white'} style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }} mb={10} fontSize={20}>
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
                  <Text color={'#4882D9'} fontWeight={'black'} mb={3} fontSize={'18px'}>
                    노래 리스트
                  </Text>
                  {paginatedSongs.map((song, index) => {
                    const songIndex = startIndex + index;
                    return (
                      <HStack
                        key={index}
                        p={2}
                        _hover={{ backgroundColor: { base: 'gray.200', _dark: 'gray.800' }, borderRadius: 'md' }}
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
                              <Text color={'#4882D9'}>{song}</Text>
                            ) : (
                              <Text>{song}</Text>
                            )}
                          </HStack>
                          <Text color={'gray.600'} fontSize={11}>
                            {bandName}
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
      </Box>
    </VStack>
  );
}
