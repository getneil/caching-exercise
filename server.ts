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
  console.log(process.env);
  console.info(`server is now running on port ${port}.`);
  init();

  const intervalMs = +(process.env.UPDATE_INTERVAL_MINUTES || 30) * 60 * 1000;
  await updateCharacters();
  setInterval(async () => {
    await updateCharacters();
  }, intervalMs);
});