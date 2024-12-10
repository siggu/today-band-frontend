import { createBrowserRouter } from 'react-router-dom';
import Root from './components/Root';
import Home from './routes/Home';
import Band from './routes/Band';
import Comment from './routes/Comment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { path: '', element: <Home /> },
      { path: 'bands/:bandId', element: <Band /> },
      { path: 'comments', element: <Comment /> },
    ],
  },
]);

export default router;
