import { DefaultAzureCredential } from "@azure/identity";
import sql from "mssql";
let pool: sql.ConnectionPool | null = null;
export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool;
  }
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(
    "https://database.windows.net/.default",
  );
  if (!process.env.SERVER)
    throw new Error("Enviroment not configured");
  const config: sql.config = {
    server: process.env.SERVER,
    database: process.env.DB,
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
