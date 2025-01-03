import Cookie from 'js-cookie';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { IComment, IUsernameLoginVariables } from './types.d';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/v1/' : 'https://today-band.onrender.com/api/v1',
  withCredentials: true,
});

export const getBands = () => instance.get('bands/').then((response) => response.data);

export const getBand = ({ queryKey }: QueryFunctionContext) => {
  const [bandId] = queryKey;
  return instance.get(`bands/${bandId}`).then((response) => response.data);
};

export const getComments = () => instance.get('comments/').then((response) => response.data);

export const postComments = ({ detail }: IComment) => {
  const token = Cookie.get('token');
  return instance
    .post(
      'comments/',
      { detail },
      {
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken') || '',
          Authorization: `Token ${token}`,
        },
      }
    )
    .then((response) => response.data);
};

export const deleteComments = (commentId: number) => {
  const token = Cookie.get('token');
  return instance
    .delete(`comments/${commentId}`, {
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken') || '',
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => response.data);
};

export const getMe = () => {
  const token = Cookie.get('token');
  return instance
    .get('users/me', {
      headers: {
        Authorization: `Token ${token}`,
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => response.data);
};

export const usernameLogIn = ({ username, password }: IUsernameLoginVariables) =>
  instance
    .post(
      `/users/log-in`,
      { username, password },
      {
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken') || '',
        },
      }
    )
    .then((response) => {
      Cookie.set('token', response.data.token);
      return response.data;
    });

export const logOut = () => {
  const token = Cookie.get('token');
  return instance
    .post(`/users/log-out`, null, {
      headers: {
        Authorization: `Token ${token}`,
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => {
      Cookie.remove('token');
      return response.data;
    });
};

export const userRegister = ({ username, password }: IUsernameLoginVariables) =>
  instance
    .post(
      `/users/sign-up`,
      { username, password },
      {
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken') || '',
        },
      }
    )
    .then((response) => response.data);

export const getLikes = () => {
  const token = Cookie.get('token');
  return instance
    .get('likes/', {
      headers: {
        Authorization: `Token ${token}`,
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => response.data);
};

export const postLikes = (bandId: string) => {
  const token = Cookie.get('token');
  return instance
    .post(`likes/${bandId}/`, null, {
      headers: {
        Authorization: `Token ${token}`,
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => response.data);
};
