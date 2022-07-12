//CONECTION TO DB
import knex from 'knex';

//ENV VAR
const { MDB_CONNECTION_HOST, MDB_CONNECTION_USER, MDB_CONNECTION_PASSWORD, MDB_CONNECTION_NAME_DB, MDB_CONNECTION_PORT } = process.env;

const config = {
    client: 'mysql',
    connection: {
      host: MDB_CONNECTION_HOST,
      port: MDB_CONNECTION_PORT,
      user: MDB_CONNECTION_USER,
      password: MDB_CONNECTION_PASSWORD,
      database: MDB_CONNECTION_NAME_DB
    },
    pool: { min: 0, max: 7 }
};

const connectionDB = knex(config);

export default connectionDB;