import { DefaultAzureCredential } from "@azure/identity";
import sql from "mssql";

enum EDbNames {
  attainDataLake = 'AttainDataLake',
  attainDMAttainAutomation = 'AttainDM.AttainAutomation'
}

const pool: {
  [key in EDbNames]: sql.ConnectionPool | null} = {
  [EDbNames.attainDataLake]: null,
  [EDbNames.attainDMAttainAutomation]: null
};

async function getPool(dbName: EDbNames): Promise<sql.ConnectionPool> {
  
  if (pool[dbName] && await isHealthy(pool[dbName])) {
    return pool[dbName]
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
  const newPool = new sql.ConnectionPool(config);
  await newPool.connect();
  pool[dbName] = newPool;
  return pool[dbName];
}


async function isHealthy(pool:sql.ConnectionPool) {
  try {
    const res = await pool.query('SELECT 1')
    return res.recordsets.length
  } catch (error) {
    console.error(error)
    console.log('Creating new Pool')
    return null
  }
}

export {
  getPool,
  EDbNames
}