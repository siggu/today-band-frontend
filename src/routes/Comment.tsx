import { useQuery } from '@tanstack/react-query';
import { Field } from '../components/ui/field';
import { Box, Button, Container, HStack, Stack, Text, Textarea, VStack } from '@chakra-ui/react';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../components/ui/pagination';
import { getComments } from '../api';
import { useState } from 'react';

interface IComment {
  detail: string;
  date: string;
}

export default function Comment() {
  const { data, isLoading } = useQuery<IComment[]>({
    queryKey: ['comment'],
    queryFn: getComments,
    initialData: [],
  });

  const pageSize = 5;
  const count: number = data?.length;
  const comments = new Array(count).fill(0).map((_, index) => data![index]?.detail);
  const dates = new Array(count).fill(0).map((_, index) => data![index]?.date);

  const [page, setPage] = useState(1);
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;
  const visibleComments = comments.slice(startRange, endRange);
  const visibleDates = dates.slice(startRange, endRange);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <Container minW={'max-content'} maxW={'2xl'} pt={100}>
      {/* 댓글 작성 */}
      <VStack mb={1} alignItems={'flex-start'}>
        <Field label='댓글 작성' required>
          <Textarea
            required
            resize={'vertical'}
            placeholder='예시) xx 밴드 추가해주세요!! 대표곡은 ~, ~가 있어요! 개인적으로는 ~, ~ 노래를 추천해요!'
          />
        </Field>
      </VStack>
      <Text mb={5} fontSize={11} color={{ base: 'red', _dark: 'red.500' }}>
        댓글을 한 번 작성하면 삭제할 수 없습니다.
      </Text>
      <VStack mb={20} alignItems={'self-end'}>
        <Button>댓글 등록</Button>
      </VStack>
      {/* 댓글 리스트 */}
      <Stack gap='4'>
        <Stack mb={5}>
          {visibleComments.map((comment, index) =>
            comment !== undefined ? (
              <HStack justifyContent={'space-between'}>
                <Text maxW={'2xl'} overflowWrap='break-word' display={'list-item'}>
                  {comment}
                </Text>
                <Text fontSize={13} color={'gray.500'}>
                  {formatDate(visibleDates[index])}
                </Text>
              </HStack>
            ) : null
          )}
        </Stack>
        <PaginationRoot
          display={'flex'}
          justifyContent={'center'}
          page={page}
          count={count}
          pageSize={pageSize}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </Container>
  );
}
