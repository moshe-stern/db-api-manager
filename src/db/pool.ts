import { DefaultAzureCredential } from "@azure/identity";
import dotenv from "dotenv";
import sql from "mssql";
const result = dotenv.config();
if (result.error) {
  console.error("Error loading .env file:", result.error);
}
let pool: sql.ConnectionPool | null = null;
export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool;
  }
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(
    "https://database.windows.net/.default",
  );
  if (!process.env.DEV_SERVER || !process.env.DB)
    throw new Error("Enviroment not configured");
  const config: sql.config = {
    server: process.env.DEV_SERVER,
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
