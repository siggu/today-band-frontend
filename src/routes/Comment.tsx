import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Field } from '../components/ui/field';
import { Button, Container, HStack, Stack, Text, Textarea, VStack } from '@chakra-ui/react';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '../components/ui/pagination';
import { deleteComments, getComments, postComments } from '../api';
import { useState } from 'react';
import { Toaster, toaster } from '../components/ui/toaster';
import { IComment } from '@/types';
import Cookie from 'js-cookie';
import useUser from '../lib/useUser';

export default function Comment() {
  const {
    data: commentData,
    isLoading: isCommentDataLoading,
    refetch,
  } = useQuery<IComment[]>({
    queryKey: ['comment'],
    queryFn: getComments,
    initialData: [],
  });

  const pageSize = 5;
  const count: number = commentData!.length;
  const comments = new Array(count).fill(0).map((_, index) => commentData![index]?.detail);
  const dates = new Array(count).fill(0).map((_, index) => commentData![index]?.date);

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

  const [newComment, setNewComment] = useState('');
  const mutation = useMutation({
    mutationFn: (newComment: { detail: string; date: string; user: string; id: number }) => postComments(newComment),
    onSuccess: () => {
      toaster.create({
        title: '댓글 등록 성공!',
        type: 'success',
        duration: 2000,
      });
      setNewComment('');
      refetch();
    },
    onError: (error: any) => {
      toaster.create({
        title: error.message,
        type: 'warning',
        duration: 2000,
      });
    },
  });

  const { userLoading, isLoggedIn, user } = useUser();

  if (isCommentDataLoading || userLoading) {
    return <div>Loading...</div>;
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) {
      toaster.create({
        title: '댓글을 입력해주세요.',
        type: 'error',
        duration: 2000,
      });
      return;
    }

    const id = Number(Cookie.get('id'));
    mutation.mutate({
      detail: newComment,
      user,
      date: '',
      id,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComments(commentId),
    onSuccess: () => {
      toaster.create({
        title: '댓글이 삭제되었습니다.',
        type: 'success',
      });
      refetch();
    },
    onError: (error: any) => {
      toaster.create({
        title: error.message,
        type: 'error',
        duration: 2000,
      });
    },
  });

  const handleDelete = (commentId: number) => {
    deleteMutation.mutate(commentId);
  };

  return (
    <Container minW={'max-content'} maxW={'2xl'} pt={100}>
      <Toaster />
      {/* 댓글 작성 */}
      <VStack mb={1} alignItems={'flex-start'}>
        <Field label='댓글 작성' required>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            resize={'vertical'}
            placeholder='예시) xx 밴드 추가해주세요!! 대표곡은 ~, ~가 있어요! 개인적으로는 ~, ~ 노래를 추천해요!'
          />
        </Field>
      </VStack>
      {/* <Text mb={5} fontSize={11} color={{ base: 'red', _dark: 'red.500' }}>
        댓글을 한 번 작성하면 삭제할 수 없습니다.
      </Text> */}
      <VStack mb={20} alignItems={'self-end'}>
        <Button onClick={handleCommentSubmit}>댓글 등록</Button>
      </VStack>
      {/* 댓글 리스트 */}
      <Stack gap='4'>
        <Stack mb={5}>
          {visibleComments.map((comment, index) =>
            comment !== undefined ? (
              <HStack mb={3} justifyContent={'space-between'}>
                <VStack gap={0} alignItems={'flex-start'}>
                  <Text maxW={'2xl'} overflowWrap='break-word' display={'list-item'}>
                    {comment}
                  </Text>
                  <Text fontSize={12}>{commentData[index].user}</Text>
                </VStack>
                <VStack alignItems={'flex-end'}>
                  <Text fontSize={13} color={'gray.500'}>
                    {formatDate(visibleDates[index])}
                  </Text>
                  {isLoggedIn && user?.name && commentData[index]?.user === user.name && (
                    <Button size='xs' colorScheme='red' onClick={() => handleDelete(commentData[index]?.id)}>
                      삭제
                    </Button>
                  )}
                </VStack>
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
