import dotenv from 'dotenv';
dotenv.config();

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { init } from './libs/db';
import { updateCharacters } from './libs/characters';


const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  response.end('hello world');
});

async function start() {
  console.log('db initializing');
  await init();
  console.log('db intialized');

  // get all characters first
  console.log('characters syncing...');
  await updateCharacters();
  console.log('characters synced');
  
  // regular polling to check if a new character or character has been updated
  const minutes = +(process.env.UPDATE_INTERVAL_MINUTES || 30);
  const intervalMs =  minutes * 60 * 1000;
  console.log(`character sync every ${minutes} minutes`);
  setInterval(async () => {
    await updateCharacters();
  }, intervalMs);

  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.info(`server is now running on port ${port}.`);
  });
}

start();