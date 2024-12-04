import sql from "mssql";
import { EDbNames, getPool } from "../db/pool";

async function getClientOrgIdByPhoneNumber(
    number: string,
): Promise<number | undefined> {
    const pool = await getPool(EDbNames.attainDataLake);
    const res = await pool.request().input("PhoneNumber", sql.VarChar(20), number)
        .query(`
            SELECT top (1) ClientOrganizationId
            FROM [dbo].[insights.Client]
            WHERE ClientActiveStatus = 'active'
            AND (ClientOrganizationId = 1098187 OR ClientOrganizationId = 427999)
            AND (ClientCellPhoneNumber = @PhoneNumber OR ClientHomePhoneNumber = @PhoneNumber)
      `);
    const records = res.recordset
    return records.length ? records[0].ClientOrganizationId : undefined
}

export {
    getClientOrgIdByPhoneNumber
}