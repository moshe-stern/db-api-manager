import { DefaultAzureCredential } from "@azure/identity";
import sql from "mssql";

enum EDbNames {
  AttainDataLake = "AttainDataLake",
  AttainDMAttainAutomation = "AttainDM.AttainAutomation",
  Master = "master",
  AttainStagingDW = "AttainStagingDW",
  AttainDMPayroll = "AttainDM.Payroll",
  AttainDMBilling = "AttainDM.Billing",
  AttainDMClinical = "AttainDM.Clinical",
  AttainDMLifecycle = "AttainDM.Lifecycle",
  AttainDataWarehouse = "AttainDataWarehouse",
  AttainDMUtilization = "AttainDM.Utilization",
}

const pool: {
  [key in EDbNames]: sql.ConnectionPool | null;
} = {
  [EDbNames.Master]: null,
  [EDbNames.AttainDMAttainAutomation]: null,
  [EDbNames.AttainDataLake]: null,
  [EDbNames.AttainStagingDW]: null,
  [EDbNames.AttainDMPayroll]: null,
  [EDbNames.AttainDMBilling]: null,
  [EDbNames.AttainDMClinical]: null,
  [EDbNames.AttainDMLifecycle]: null,
  [EDbNames.AttainDataWarehouse]: null,
  [EDbNames.AttainDMUtilization]: null,
};

async function getPool(dbName: EDbNames): Promise<sql.ConnectionPool> {
  if (pool[dbName] && (await isHealthy(pool[dbName]))) {
    return pool[dbName];
  }

  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(
    "https://database.windows.net/.default",
  );
  if (!process.env.SERVER) throw new Error("Enviroment not configured");
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

async function isHealthy(pool: sql.ConnectionPool) {
  try {
    const res = await pool.query("SELECT 1");
    return res.recordsets.length;
  } catch (error) {
    console.error(error);
    console.log("Creating new Pool");
    return null;
  }
}

export { getPool, EDbNames };
