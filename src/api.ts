import Cookie from 'js-cookie';
import { QueryFunctionContext } from '@tanstack/react-query';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
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
