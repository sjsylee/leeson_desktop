import type { NextApiRequest, NextApiResponse } from "next";
import mariadb from "mariadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { kwd, related_kwd, networkOpt, config } = JSON.parse(req.body);

  let host: string;

  if (networkOpt === "in") {
    host = config.HOST_IN;
  } else {
    host = config.HOST_OUT;
  }

  let result: boolean = true;
  let errorLog: string;

  const pool = mariadb.createPool({
    host: host,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    connectionLimit: 5,
  });

  let conn, rows;

  try {
    conn = await pool.getConnection();
    conn.query("USE Keyword");
    rows = await conn.query(
      `INSERT INTO cp_kwd VALUES ('${kwd}', '${related_kwd}')`
    );
  } catch (err) {
    result = false;
    errorLog = err.message;
  } finally {
    if (conn) {
      conn.end();
    }
  }

  if (errorLog.includes("PRIMARY")) {
    try {
      conn = await pool.getConnection();
      conn.query("USE Keyword");
      rows = await conn.query(
        `UPDATE cp_kwd SET related_kwd = '${related_kwd}' WHERE kwd='${kwd}'`
      );
      errorLog = "update";
      result = true;
    } catch (err) {
      result = false;
      console.log(errorLog);
    } finally {
      if (conn) {
        conn.end();
      }
    }
  }

  await pool.end();

  res.status(200).json({ result: result, errorLog: errorLog });
}
