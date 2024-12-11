import { ICubeStatus } from "attain-aba-shared";
import { EDbNames, getPool } from "../db/pool";

async function getRefreshTime(dbName: EDbNames): Promise<ICubeStatus> {
    const pool = await getPool(dbName);
    const res = await pool.query(`
            SELECT TOP (1) *
            FROM [dbo].[LastRefreshTime]
        `);
    const set = res.recordset[0]
    return {
        loadTime: set?.LoadTime,
        pipelineName: set?.PipelineName,
        name: dbName.replace("AttainDM.", "") + " Cube"
    }
}

async function getRefreshTimes() {
    const names = Object.values(EDbNames).filter((val) =>
        val.startsWith("AttainDM"),
    );
    const refreshTimesPromises = names.map((name) => getRefreshTime(name));
    const refreshTimes = await Promise.all(refreshTimesPromises);
    return refreshTimes;
}

export { getRefreshTimes };
