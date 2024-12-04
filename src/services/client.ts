import sql from "mssql";
import { EDbNames, getPool } from "../db/pool";
import { IClient } from "attain-aba-shared";

async function getClientByPhoneNumber(
    number: string,
): Promise<IClient | undefined> {
    const pool = await getPool(EDbNames.attainDataLake);
    const res = await pool.request().input("PhoneNumber", sql.VarChar(20), number)
        .query(`
            SELECT top (1) ClientOrganizationId, ClientMailingStateProvince
            FROM [dbo].[insights.Client]
            WHERE ClientActiveStatus = 'active'
            AND (ClientOrganizationId = 1098187 OR ClientOrganizationId = 427999)
            AND (ClientCellPhoneNumber = @PhoneNumber OR ClientHomePhoneNumber = @PhoneNumber)
      `);
    const records = res.recordset
    return records.map(rec => ({
        orgId: rec.ClientOrganizationId,
        state: rec.ClientMailingStateProvince
    }))[0]
}

export {
    getClientByPhoneNumber
}