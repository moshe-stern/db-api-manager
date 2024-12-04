import { EDbNames, getPool } from "../db/pool";
import sql from "mssql";
import { IClientResponseRecord } from "../types";
async function getClientByNumber(
  number: string,
): Promise<IClientResponseRecord[]> {
  const pool = await getPool(EDbNames.attainDMAttainAutomation);
  const res = await pool.request().input("PhoneNumber", sql.VarChar(20), number)
    .query(`
        SELECT *
        FROM [dbo].[TwilioClientResponses]
        WHERE [PhoneNumber] = @PhoneNumber;
    `);

  return res.recordset.map((row) => ({
    id: row.Id,
    phoneNumber: row.PhoneNumber,
    responseType: row.ResponseType,
    body: row.Body,
    responseDate: new Date(row.ResponseDate),
  }));
}

async function createClientResponseRecord(
  rec: Omit<IClientResponseRecord, "id">,
): Promise<number> {
  const pool = await getPool(EDbNames.attainDMAttainAutomation);
  const res = await pool
    .request()
    .input("PhoneNumber", sql.VarChar(20), rec.phoneNumber)
    .input("ResponseType", sql.VarChar(20), rec.responseType)
    .input("Body", sql.VarChar(1000), rec.body)
    .input("ResponseDate", sql.DateTime, rec.responseDate).query(`
        INSERT INTO [dbo].[TwilioClientResponses]
        ([PhoneNumber], [ResponseType], [Body], [ResponseDate])
        VALUES (@PhoneNumber, @ResponseType, @Body, @ResponseDate);
    `);

  return res.rowsAffected.length;
}

export { createClientResponseRecord, getClientByNumber };
