import { Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Root() {
  return (
    <Box
      height='100vh'
      overflowY='scroll'
      css={{
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      p={5}
    >
      <Header />
      <Outlet />
    </Box>
  );
}
