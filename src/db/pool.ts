import { DefaultAzureCredential } from "@azure/identity";
import sql from "mssql";
let pool: sql.ConnectionPool | null = null;


enum EDbNames {
  attainDataLake = 'AttainDataLake',
  attainDMAttainAutomation = 'AttainDM.AttainAutomation'
}


async function getCurrentDatabase(pool: sql.ConnectionPool): Promise<string> {
  const result = await pool.query('SELECT DB_NAME() as CurrentDB');
  return result.recordset[0]['CurrentDB']
}



async function getPool(dbName: EDbNames): Promise<sql.ConnectionPool> {
  if (pool) {
    const currDb = await getCurrentDatabase(pool)
    if (dbName === currDb) {
      return pool;
    }
    await pool.close()
  }
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(
    "https://database.windows.net/.default",
  );
  if (!process.env.SERVER)
    throw new Error("Enviroment not configured");
  const config: sql.config = {
    server: process.env.SERVER,
    database: dbName,
    options: {
      encrypt: true,
    },
    authentication: {
      type: "azure-active-directory-access-token",
      options: {
        token: tokenResponse.token,
      },
    },
  };
  pool = await sql.connect(config);
  return pool;
}

export {
  getPool,
  EDbNames
}