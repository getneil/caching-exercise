#Caching Exercise#

## Setup ##
just run the following command, make sure to have at least NodeJS v12.0+
```
  $ npm install
```

create a `.env` file within the repository with the following contents
```
PUBLIC_KEY=XXXX
PRIVATE_KEY=zzzzz
DB_PATH=./marvel_character_cache.db
UPDATE_INTERVAL_MINUTES=5
```
Make sure the user has write permission to the directory value of `DB_PATH`

## Running ##
```
  $ npm run start
```
Just wait for a few minutes until the terminal states that the server is running
Depending on the speed of your internet on how fast the server can start

