import sqlite3 from 'better-sqlite3';

const db = sqlite3(process.env.DB_PATH || './marvel_cache.db');

// initialize create the db tables
export async function init() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS update_logs (
      lastUpdate INTEGER PRIMARY KEY NOT NULL
    );
  `);
}

// insert or update characters
export async function upsertCharacters(characters:Array<Object>) {
  const upsertCharacter = db.prepare('INSERT OR REPLACE INTO characters (id, name, description) VALUES (?,?,?)');
  if (characters.length) {
    const insertMany = db.transaction((characters) => {
      for(let character of characters) {
        const { id, name, description } = character;
        upsertCharacter.run(id, name, description);
      }
    });
    await insertMany(characters);
  }
}

export async function getCharacterIds() {
  const result = await db.prepare('SELECT id FROM characters;').all();
  const ids = result.map(({ id }) => id );
  return ids;
}

// insert a new timestamp, only used to update on when the characters table was last updated
export async function addNewLog(ts:Date) {
  const logQuery = db.prepare('INSERT INTO update_logs (lastUpdate) VALUES (?)');
  const lastUpdate = ts ? +ts : +new Date();
  await logQuery.run(lastUpdate);
}

// returns the latest timestamp on when the latest characters update was done
export async function getLatestLog() {
  const result = await db.prepare('SELECT * FROM update_logs ORDER BY lastUpdate DESC LIMIT 1').get();
  return result ? new Date(result.lastUpdate) : null;
}