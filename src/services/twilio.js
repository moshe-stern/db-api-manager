"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientResponseRecord = createClientResponseRecord;
exports.getClientByNumber = getClientByNumber;
const pool_1 = require("../db/pool");
const mssql_1 = __importDefault(require("mssql"));
async function getClientByNumber(number) {
    const pool = await (0, pool_1.getPool)();
    const res = await pool.request().input("PhoneNumber", mssql_1.default.VarChar(20), number)
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
async function createClientResponseRecord(rec) {
    const pool = await (0, pool_1.getPool)();
    const res = await pool
        .request()
        .input("PhoneNumber", mssql_1.default.VarChar(20), rec.phoneNumber)
        .input("ResponseType", mssql_1.default.VarChar(20), rec.responseType)
        .input("Body", mssql_1.default.VarChar(1000), rec.body)
        .input("ResponseDate", mssql_1.default.DateTime, rec.responseDate).query(`
        INSERT INTO [dbo].[TwilioClientResponses]
        ([PhoneNumber], [ResponseType], [Body], [ResponseDate])
        VALUES (@PhoneNumber, @ResponseType, @Body, @ResponseDate);
    `);
    return res.rowsAffected.length;
}
