import dotenv from 'dotenv';
dotenv.config();

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { init, getCharacterIds, getCharacter } from './libs/db';
import { updateCharacters } from './libs/syncer';

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
  console.log(`${request.method?.toUpperCase()} ${request.url} -> starting...`);

  const urlElements = request && request.url ? request.url.split('/') : [];

  if (request.url === '/characters') {
    
    const ids = await getCharacterIds();

    response.setHeader('Content-Type','text/json');
    response.write(JSON.stringify(ids || []));

  } else if (urlElements.length === 3) {

    const characterId = urlElements[2];
    const character = await getCharacter(characterId);

    response.setHeader('Content-Type','text/json');
    response.write(character ? JSON.stringify(character) : 'character not found');

  } else {
    response.write('please use GET /characters or GET /characters/:id');
  }

  console.log(`${request.method?.toUpperCase()} ${request.url} -> end`);
  response.end();
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
  console.log(`character syncs every ${minutes} minutes`);
  setInterval(async () => {
    await updateCharacters();
  }, intervalMs);

  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.info(`server is now running on port ${port}.`);
  });
}

start();