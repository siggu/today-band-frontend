import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <Box>
      <HStack justifyContent={'space-between'} py={5} px={10} borderBottomWidth={1}>
        <HStack>
          <Text>오늘의 밴드</Text>
        </HStack>
      </HStack>
      <Outlet />
    </Box>
  );
}
