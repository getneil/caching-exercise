import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import { init, getCharacterIds, getCharacter } from './libs/db';
import { updateCharacters } from './libs/syncer';

/*
const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
  console.log(`${request.method?.toUpperCase()} ${request.url} -> starting...`);
  const method = request.method;
  const urlElements = request && request.url ? request.url.split('/') : [];

  if (method === 'get' && request.url === '/characters') {
    
    const ids = await getCharacterIds();

    response.setHeader('Content-Type','text/json');
    response.write(JSON.stringify(ids || []));

  } else if (method === 'get' && urlElements.length === 3) {

    const characterId = urlElements[2];
    const character = await getCharacter(characterId);

    response.setHeader('Content-Type','text/json');
    response.write(character ? JSON.stringify(character) : 'character not found');

  } else {
    response.write('please use GET /characters or GET /characters/:id');
  }

  console.log(`${method?.toUpperCase()} ${request.url} -> end`);
  response.end();
});
*/
const app: express.Application = express();
app.get('/', (req,res) => {
  res.send(`
    please use:
      GET /characters 
      GET /characters/:characterId
    
    or visit /api-docs
  `);
});

app.get('/characters', async (req, res) => {
  const ids = await getCharacterIds();
  res.status(200).json(ids || []);
});

app.get('/characters/:characterId', async (req, res) => {
  const { characterId } = req.params;
  const character = await getCharacter(characterId);
  if (character) {
    res.json(character);
  } else {
    res.status(404).send('character not found.');
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  app.listen(port, () => {
    console.info(`server is now running on port ${port}.`);
  });
}

start();