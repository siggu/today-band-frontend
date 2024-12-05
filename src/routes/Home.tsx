import React, { useState, useEffect, useRef } from 'react';
import { AccordionItemTrigger, Box, HStack, Image, Link, List, PopoverTrigger, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { LuExternalLink } from 'react-icons/lu';
import { IoPlaySkipBackSharp, IoPlaySkipForwardSharp } from 'react-icons/io5';
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5';
import { IoList } from 'react-icons/io5';
import { AiFillSound } from 'react-icons/ai';
import { getBands } from '../api';
import { Slider } from '../components/ui/slider';
import { PopoverBody, PopoverContent, PopoverRoot } from '../components/ui/popover';
import { AccordionItem, AccordionRoot } from '../components/ui/accordion';

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
    const songName = songs[currentSongIndex]?.trim();

    // 오디오가 초기화되지 않은 경우 초기화
    if (!audio && songName) {
      const newAudio = new Audio(`/songs/${songName}.mp3`);
      setAudio(newAudio);
      setIsPlaying(true);

      try {
        await newAudio.play(); // 오디오 재생
      } catch (error) {
        console.error('Error playing audio:', error);
      }
      return;
    }

    // 오디오가 초기화된 경우 재생/일시정지
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        try {
          await audio.play(); // 오디오 재생
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipBack = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        playAudio();
      }
      setIsPlaying(!isPlaying);
    }
    setIsImageChanging(true);
    setTimeout(() => {
      setSlideDirection('left');

      const newIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(newIndex);
      setIsImageChanging(false);
    }, 0);
  };

  const skipForward = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        playAudio();
      }
      setIsPlaying(!isPlaying);
    }
    setIsImageChanging(true);
    setTimeout(() => {
      setSlideDirection('right');
      const newIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
      setCurrentSongIndex(newIndex);
      setIsImageChanging(false);
    }, 0);
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

  const onVolumeChange = (value: any) => {
    if (audio) {
      audio.volume = value / 100;
      console.log(audio.volume);
    }
  };

  return (
    <>
      <HStack mb={70} flexWrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
        <VStack justifyContent={'center'} p={30}>
          <Box>
            <Image h={550} src={bandForToday.photo} alt={bandForToday.name} />
          </Box>
        </VStack>
        <VStack gap={5} justifyContent={'center'} alignItems={'flex-start'} p={30}>
          <HStack mb={5}>
            <Link href={`bands/${bandForToday.id}`}>
              <HStack>
                <Text fontSize={25}>{`${bandForToday.name}`}</Text>
                <LuExternalLink />
              </HStack>
            </Link>
          </HStack>
          <HStack>
            <Text>결성일:</Text>
            <Text>{bandForToday.formation_date}</Text>
          </HStack>
          <HStack>
            <Text>데뷔일:</Text>
            <Text>{bandForToday.debut_date}</Text>
          </HStack>
          <HStack wrap={'wrap'}>
            <Text>장르:</Text>
            {bandForToday.genre.map((genre, index) =>
              index + 1 < bandForToday.genre.length ? (
                <Text key={genre.id}>{genre.name}, </Text>
              ) : (
                <Text key={genre.id}>{genre.name}</Text>
              )
            )}
          </HStack>
          <HStack>
            <Text>멤버:</Text>
            <Text>{bandForToday.members}</Text>
          </HStack>
        </VStack>
      </HStack>
      <VStack mb={20} justifyContent='center' alignItems='center'>
        <Text style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }} mb={5} fontSize={20}>
          {songs[currentSongIndex]}
        </Text>
        <Box position='relative' w={400} h={400} mb={20} overflow='hidden'>
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
        <HStack gap={28} minW={'700px'} display='flex' justifyContent='center' alignItems='center'>
          <PopoverRoot unstyled>
            <PopoverTrigger>
              <AiFillSound style={{ marginTop: '3px' }} />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Slider
                  height={'200px'}
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
                  <AccordionRoot variant={'plain'} rounded={5}>
                    <AccordionItem key={index} value={element}>
                      <AccordionItemTrigger onClick={() => selectSong(index)}>
                        {index + 1}. {element}
                      </AccordionItemTrigger>
                    </AccordionItem>
                  </AccordionRoot>
                ))}
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </HStack>
      </VStack>
    </>
  );
}
