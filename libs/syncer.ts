import { getLatestLog, upsertCharacters, addNewLog } from './db';
import { getCharacters } from './marvel-api';

export async function updateCharacters() {
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
          console.log('no more characters to > the last upsert date.');
          break;
        }
      }
      loopCount++;
    } catch (error) {
      console.error(error);
      // aparently marvel api is a bit slow and error prone or maybe my internet is bad
      // enable retry 
    }
  }

  if (charactersToUpsert.length) {
    console.log('upserting characters:', charactersToUpsert.length);
    await upsertCharacters(charactersToUpsert);
    await addNewLog();
  } else {
    console.log('no characters to upsert');
  }
}

// updateCharacters();