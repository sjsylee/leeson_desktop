import type { NextApiRequest, NextApiResponse } from "next";
import mariadb from "mariadb";

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
    conn.query("USE Category");
    rows = await conn.query(
      `SELECT * FROM amz_category_list WHERE name LIKE '%${q}%'`
    );
    if (rows.length == 0) {
      rows = await conn.query(
        `SELECT * FROM amz_category_list WHERE displayCategoryCode=${q}`
      );
    }
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      conn.end();
      await pool.end();
    }
    result = rows.map((d) => {
      return {
        value: d["displayCategoryCode"],
        label: d["name"],
      };
    });
  }

  console.log(result);

  res.status(200).json({ result: result });
}
