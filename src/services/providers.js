"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProvidersByEmails = getProvidersByEmails;
const pool_1 = require("../db/pool");
async function getProvidersByEmails(emails) {
    const pool = await (0, pool_1.getPool)();
    const res = await pool.query(`SELECT 
           p.[Provider Email Address], 
           p.[Provider ID], 
           ds.[Subregion]
       FROM 
           [dbo].[Provider] p
       JOIN 
           [dbo].[DataUser] ds 
           ON ds.[Email] = p.[Provider Email Address]
       WHERE 
           p.[Provider Active Status] = 'ACTIVE' and p.[Provider Email Address] in (${emails.map((email) => `${email}`).join(',')})
       ORDER BY 
           p.[Provider ID];`);
    // map into Provider type
    return res.recordsets;
}
