import dotenv from 'dotenv';
dotenv.config();
import { getLatestLog, init } from './db';
import { getCharacters } from './marvel-api';


export async function updateCharacters() {
  await init();
  const lastLogUpdate:any = await getLatestLog();

  const limit = 100;
  let modifiedSince:string = '';
  if (lastLogUpdate !== null) {
    modifiedSince = lastLogUpdate.toISOString();
  }

  let keepLookingForCharacters = true;
  let loopCount = 0;

  const charactersToUpsert = [];
  while(keepLookingForCharacters) {
    try {
      const params: {[k: string]: any} = {
        limit,
        offset: loopCount * limit,
        orderBy: '-modified',
      }
  
      if (modifiedSince) {
        params.modifiedSince = modifiedSince;
      }
  
      // retrieve a set of characters from marvel api
      const { total, count, results:characters = [] } = await getCharacters(params);
      console.log('total:', total);
      if (count < limit || !characters.length) {
        keepLookingForCharacters = false;
      }

      for(let character of characters) {
        if (!lastLogUpdate || lastLogUpdate < new Date(character.modified)) {
          // !lastLogUpdate means this is the first time to insert data
          // < character is new or has been updated compared to the last caching process
          charactersToUpsert.push(character);
        } else if (lastLogUpdate) {
          // it would mean there is no more  character that needs to be upserted
          break;
        }
      }
      loopCount++;
    } catch (error) {
      console.error(error);
      keepLookingForCharacters = false;
    }
  }

  console.log(charactersToUpsert.length);
}

updateCharacters();