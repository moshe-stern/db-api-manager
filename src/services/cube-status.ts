import { ICubeStatus } from "attain-aba-shared";
import { EDbNames, getPool } from "../db/pool";

async function getRefreshTime(dbName: EDbNames): Promise<ICubeStatus> {
  const pool = await getPool(dbName);
  const res = await pool.query(`
            SELECT TOP (1) *
            FROM [dbo].[LastRefreshTime]
        `);
  const set = res.recordset[0];
  return {
    loadTime: set?.LoadTime,
    pipelineName: set?.PipelineName,
    name: dbName.replace("AttainDM.", "") + " Cube",
  };
}

async function getRefreshTimes() {
  const names = Object.values(EDbNames).filter((val) =>
    val.startsWith("AttainDM"),
  );
  const refreshTimesPromises = names.map((name) => getRefreshTime(name));
  const refreshTimes = await Promise.all(refreshTimesPromises);
  return refreshTimes;
}

async function getMsgBoard() {
  const pool = await getPool(EDbNames.AttainDMAttainAutomation);
  const res = await pool.query(`
          SELECT TOP (1) [Message]
          FROM [dbo].[MessageBoard]
        `);
  const set = res.recordset[0];
  return set?.Message as string;
}

async function updateMsgBoard(msg: string) {
  const pool = await getPool(EDbNames.AttainDMAttainAutomation);
  const res = await pool.request().input("msg", msg).query(`
                    update [dbo].[MessageBoard] 
                    set [Message] = @msg
              `);
  return res.rowsAffected.length;
}

export { getRefreshTimes, getMsgBoard, updateMsgBoard };
