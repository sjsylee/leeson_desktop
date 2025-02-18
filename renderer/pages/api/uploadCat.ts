import type { NextApiRequest, NextApiResponse } from "next";
import mariadb from "mariadb";
import { log } from "node:console";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { displayCategoryCode, name, networkOpt, config } = JSON.parse(
    req.body
  );

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
    conn.query("USE Category");
    rows = await conn.query(
      `INSERT INTO amz_category_list VALUES ('${name}', ${displayCategoryCode})`
    );
  } catch (err) {
    result = false;
    errorLog = err.message;
  } finally {
    if (conn) {
      conn.end();
      await pool.end();
    }
  }

  console.log(result);

  res.status(200).json({ result: result, errorLog: errorLog });
}
