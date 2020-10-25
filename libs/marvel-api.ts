import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import crypto from 'crypto';
import * as _ from 'lodash';

const PUBLIC_KEY:string='1507fc349df5755790d1f2709ed6e6aa';
const PRIVATE_KEY:string='e8de33df1c1613f5e7b1938c3c740f4f1856fcb5';

const marvelHttpClient = axios.create({
  baseURL: 'http://gateway.marvel.com/v1/public',
  params: {
    apikey: PUBLIC_KEY,
  }
});

marvelHttpClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const ts:number = +new Date();
  const hash:string = [ts,PRIVATE_KEY,PUBLIC_KEY].join('');

  config.params['ts'] = ts;
  config.params['hash'] = crypto.createHash('md5').update(hash).digest('hex');

  return config;
});

// the only expected value for params for now is { nameStartsWith: '[a-z0-9]' }
export async function getCharacters(params = {}) {
  const response:AxiosResponse = await marvelHttpClient.get('/characters', {
    params: {
      limit: 100,
      ...params,
    }
  });
  return _.get(response,'data.data', null);
};

export async function getCharacter(characterId:any) {
  const response:AxiosResponse = await marvelHttpClient.get(`/characters/${characterId}`);
  return _.get(response, 'data.data.results[0]', null);
}

// async function start() {
//   const result = await getCharacters({
//     nameStartsWith: 'a',
//   });
// }

// start();

