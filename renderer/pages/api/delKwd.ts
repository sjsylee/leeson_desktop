import type { NextApiRequest, NextApiResponse } from "next";
import mariadb from "mariadb";
import { log } from "node:console";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = req.query.q;
  const so = req.query.networkOpt;

  const { config } = JSON.parse(req.body);

  let host: string;

  if (so === "in") {
    host = config.HOST_IN;
  } else {
    host = config.HOST_OUT;
  }

  console.log(host);

  let result: any[];

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
    rows = await conn.query(`DELETE FROM cp_kwd WHERE kwd='${q}'`);
  } catch (err) {
    console.log(err);

    throw err;
  } finally {
    if (conn) {
      conn.end();
      await pool.end();
      console.log("conn, pool end ...");
    }
  }

  res.status(200).json({ result: result });
}
