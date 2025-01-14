import { IProvider } from 'attain-aba-shared'
import { EDbNames, getPool } from '../db/pool'

async function getProvidersByEmails(emails: string[]): Promise<IProvider[]> {
     const pool = await getPool(EDbNames.AttainDMAttainAutomation)
     const res = await pool.query(
          `SELECT 
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
           p.[Provider ID];`
     )
     // map into Provider type
     return res.recordsets as unknown as IProvider[]
}

export { getProvidersByEmails }
