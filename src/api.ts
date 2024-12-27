import Cookie from 'js-cookie';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { IComment, IUsernameLoginVariables } from './types.d';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/api/v1/' : 'https://today-band.onrender.com/',
  withCredentials: true,
});

export const getBands = () => instance.get('bands/').then((response) => response.data);

export const getBand = ({ queryKey }: QueryFunctionContext) => {
  const [bandId] = queryKey;
  return instance.get(`bands/${bandId}`).then((response) => response.data);
};

export const getComments = () => instance.get('comments/').then((response) => response.data);

export const postComments = ({ detail }: IComment) =>
  instance
    .post(
      'comments/',
      { detail },
      {
        headers: {
          'X-CSRFToken': Cookie.get('csrftoken') || '',
          Authorization: `Bearer ${Cookie.get('authToken') || ''}`,
        },
      }
    )
    .then((response) => response.data);

export const deleteComments = (commentId: number) =>
  instance
    .delete(`comments/${commentId}`, {
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken') || '',
        Authorization: `Bearer ${Cookie.get('authToken') || ''}`,
      },
    })
    .then((response) => response.data);

export const getMe = () => instance.get(`users/me`).then((response) => response.data);

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
    .then((response) => response.data);

export const logOut = () =>
  instance
    .post(`/users/log-out`, null, {
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => response.data);

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

export const getLikes = () => instance.get(`likes/`).then((response) => response.data);

export const postLikes = (bandId: string) =>
  instance
    .post(`likes/${bandId}/`, null, {
      headers: {
        'X-CSRFToken': Cookie.get('csrftoken') || '',
      },
    })
    .then((response) => response.data);
