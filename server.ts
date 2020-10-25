import dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { init } from './libs/db';

dotenv.config();

const port = process.env.PORT || 8080;

const server = createServer((request: IncomingMessage, response: ServerResponse) => {
  response.end('hello world');
});

server.listen(port, () => {
  console.log(process.env);
  console.info(`server is now running on port ${port}.`);
  init();
});