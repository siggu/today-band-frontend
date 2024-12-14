import Cookie from 'js-cookie';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';
import { IUsernameLoginVariables } from './types.d';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
  withCredentials: true,
});

interface IComment {
  detail: string;
  date: string;
}

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
        },
      }
    )
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
