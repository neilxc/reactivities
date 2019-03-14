import axios from 'axios';
import { routingStore as router } from '../../index';
import commonStore from '../stores/commonStore';

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.request.use(
  config => {
    if (commonStore.token)
      config.headers.Authorization = `Bearer ${commonStore.token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  if (error.response.status === 404) {
    router.push('/404');
  }
  if (error.response.status === 500) {
    router.push('/serverError');
    return;
  }
  if (error.response.status === 400) {
    const err = error.response.data;
    let appErrors;
    if (err && typeof badRequest === 'object') {
      appErrors = Object.keys(err).reduce((r, k) => {
        return r.concat(err[k]);
      }, []);
    }
    throw appErrors;
  }

  console.log('interceptor - not a 404 or 500');
  console.log(error.response);
  throw error.response;
});

const responseBody = res => Promise.resolve(res.data);

const sleep = x => new Promise(resolve => setTimeout(() => resolve(x), 200));

const requests = {
  get: url =>
    axios
      .get(url)
      .then(sleep)
      .then(responseBody),
  post: (url, body) =>
    axios
      .post(url, body)
      .then(sleep)
      .then(responseBody),
  put: (url, body) =>
    axios
      .put(url, body)
      .then(sleep)
      .then(responseBody),
  del: url =>
    axios
      .delete(url)
      .then(sleep)
      .then(responseBody)
};

const Activities = {
  all: () => requests.get(`/activities`),
  get: id => requests.get(`/activities/${id}`),
  create: activity => requests.post(`/activities`, activity),
  update: activity => requests.put(`/activities/${activity.id}`, activity),
  delete: id => requests.del(`/activities/${id}`),
  attend: id => requests.post(`/activities/${id}/attend`),
  unattend: id => requests.del(`/activities/${id}/attend`)
};

const Users = {
  current: () => requests.get(`/user`),
  login: (email, password) =>
    requests.post('/users/login', { email, password }),
  register: (values) =>
    requests.post('/users/register', values)
};

export default {
  Activities,
  Users
};
