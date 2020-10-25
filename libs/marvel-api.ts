import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';
import * as _ from 'lodash';

const marvelHttpClient = axios.create({
  baseURL: 'http://gateway.marvel.com/v1/public',
  params: {
    apikey: process.env.PUBLIC_KEY,
  }
});

marvelHttpClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const ts:number = +new Date();
  const hash:string = [
    ts,
    process.env.PRIVATE_KEY,
    process.env.PUBLIC_KEY].join('');

  config.params['ts'] = ts;
  config.params['hash'] = crypto.createHash('md5').update(hash).digest('hex');

  return config;
});

// the only expected value for params for now is { modifiedSince: date }
export async function getCharacters(params = {}) {
  try {
    console.log('getting 100 characters...')
    const response:AxiosResponse = await marvelHttpClient.get('/characters', { params });
    console.log('done getting 100 characters');
    return _.get(response,'data.data', null);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function getCharacter(characterId:any) {
  const response:AxiosResponse = await marvelHttpClient.get(`/characters/${characterId}`);
  return _.get(response, 'data.data.results[0]', null);
}

// async function start() {
//   const result = await getCharacters({
//     modifiedSince: new Date(),
//   });
//   console.log(result);
// }

// start();

