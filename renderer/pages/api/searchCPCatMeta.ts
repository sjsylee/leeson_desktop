import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { fetchJson } from "../../lib/api";
import mariadb from "mariadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { catCode, config, networkOpt } = JSON.parse(req.body);

  let status: number;
  let result = [];

  // ** DB로 대체 **

  // const datetime =
  //   new Date()
  //     .toISOString()
  //     .substr(2, 17)
  //     .replace(/:/gi, "")
  //     .replace(/-/gi, "") + "Z";
  // const method = "GET";
  // const algorithm = "sha256";
  // const path = `/v2/providers/seller_api/apis/api/v1/marketplace/meta/category-related-metas/display-category-codes/${catCode}`;
  // const query = "";

  // const message = datetime + method + path + query;
  // const urlpath = path + "?" + query;

  // const signature = crypto
  //   .createHmac(algorithm, secretKey)
  //   .update(message)
  //   .digest("hex");
  // const authorization =
  //   "CEA algorithm=HmacSHA256, access-key=" +
  //   accessKey +
  //   ", signed-date=" +
  //   datetime +
  //   ", signature=" +
  //   signature;

  // const options = {
  //   hostname: "api-gateway.coupang.com",
  //   port: 443,
  //   path: urlpath,
  //   method: method,
  //   headers: {
  //     "Content-Type": "application/json;charset=UTF-8",
  //     Authorization: authorization,
  //     "X-EXTENDED-TIMEOUT": 90000,
  //   },
  // };
  // try {
  //   const r = await fetchJson(
  //     `https://api-gateway.coupang.com${urlpath}`,
  //     options
  //   );
  //   status = 200;
  //   result = r.data["attributes"].filter((d) => d["required"] === "MANDATORY");
  // } catch (err) {
  //   status = err.status;
  // }

  let host: any;

  if (networkOpt === "in") {
    host = config.HOST_IN;
  } else {
    host = config.HOST_OUT;
  }

  console.log(host);

  const pool = mariadb.createPool({
    host: host,
    port: config.PORT,
    user: config.USER,
    password: config.PASSWORD,
    connectionLimit: 5,
  });

  let conn, dats, rows;

  try {
    conn = await pool.getConnection();
    conn.query("USE Category");
    dats = await conn.query(
      `SELECT * FROM cp_category_meta WHERE cat_code = ${catCode}`
    );
    rows = await conn.query(
      `SELECT nameKo FROM cp_category_list WHERE displayCategoryCode = ${catCode}`
    );
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

  try {
    for (let i = 1; i <= 4; i++) {
      if (dats[0][`option_name_${i}`]) {
        result.push({
          attributeTypeName: dats[0][`option_name_${i}`],
          dataType: dats[0][`option_d_type_${i}`],
          inputType: "INPUT",
          inputValues: [],
          basicUnit: dats[0][`option_b_unit_${i}`],
          usableUnits: dats[0][`option_a_unit_${i}`]
            ? dats[0][`option_a_unit_${i}`].split(",")
            : [],
          required: "MANDATORY",
          groupNumber: "NONE",
          exposed: "EXPOSED",
        });
      }
    }
  } catch {
    status = 400;
  }

  res.status(200).json({
    status: status,
    result: result,
    cat_title: dats[0] ? dats[0]["name"] : dats[0],
  });
}
