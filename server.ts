import dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { init } from './libs/db';
import { updateCharacters } from './libs/characters';

dotenv.config();

const port = process.env.PORT || 8080;

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  response.end('hello world');
});

server.listen(port, async () => {
  console.info(`server is now running on port ${port}.`);
  await init();
  console.log('database has been intialized');

  const minutes = +(process.env.UPDATE_INTERVAL_MINUTES || 30);
  const intervalMs =  minutes * 60 * 1000;
  console.log(`regular character sync is happening every ${minutes} minutes`);
  await updateCharacters();
  setInterval(async () => {
    await updateCharacters();
  }, intervalMs);
});