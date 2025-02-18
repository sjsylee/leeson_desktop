import XLSX, { ColInfo, WorkSheet } from "xlsx-js-style";
import { log } from "console";

function autoFitColumns(worksheet: WorkSheet): void {
  const [firstCol, lastCol] = worksheet["!ref"]?.replace(/\d/, "").split(":");

  const numRegexp = new RegExp(/\d+$/g);

  const firstColIndex = firstCol.charCodeAt(0),
    lastColIndex = lastCol.charCodeAt(0),
    rows = +numRegexp.exec(lastCol)[0];

  const objectMaxLength: ColInfo[] = [];

  // Loop on columns
  for (let colIndex = firstColIndex; colIndex <= lastColIndex; colIndex++) {
    const col = String.fromCharCode(colIndex);
    let maxCellLength = 0;

    // Loop on rows
    for (let row = 1; row <= rows; row++) {
      try {
        const cellLength = worksheet[`${col}${row}`].v.length + 1;
        if (cellLength > maxCellLength) maxCellLength = cellLength;
      } catch {}
    }

    objectMaxLength.push({ width: maxCellLength });
  }
  worksheet["!cols"] = objectMaxLength;
}

export function exportWorksheet(f_n: string, tar: string, json: any[]) {
  let myFile = `${f_n}`;

  //Had to create a new workbook and then add the header
  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);

  const cat_hd = [
    [
      {
        v: "name",
        t: "s",
        s: {
          font: {
            sz: "13",
            color: { rgb: "FFFFFF" },
            bold: true,
          },
          fill: {
            fgColor: { rgb: "141E46" },
            bold: true,
          },
          alignment: {
            horizontal: "center",
          },
          border: {
            right: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
        },
      },
      {
        v: "displayCategoryCode",
        t: "s",
        s: {
          font: {
            sz: "13",
            color: { rgb: "FFFFFF" },
            bold: true,
          },
          fill: {
            fgColor: { rgb: "141E46" },
            bold: true,
          },
          alignment: {
            horizontal: "center",
          },
          border: {
            right: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
        },
      },
    ],
  ];
  const kwd_hd = [
    [
      {
        v: "kwd",
        t: "s",
        s: {
          font: {
            sz: "13",
            color: { rgb: "FFFFFF" },
            bold: true,
          },
          fill: {
            fgColor: { rgb: "141E46" },
            bold: true,
          },
          alignment: {
            horizontal: "center",
          },
          border: {
            right: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
        },
      },
      {
        v: "related_kwd",
        t: "s",
        s: {
          font: {
            sz: "13",
            color: { rgb: "FFFFFF" },
            bold: true,
          },
          fill: {
            fgColor: { rgb: "141E46" },
            bold: true,
          },
          alignment: {
            horizontal: "center",
          },
          border: {
            right: {
              style: "thin",
              color: "000000",
            },
            left: {
              style: "thin",
              color: "000000",
            },
            top: {
              style: "thin",
              color: "000000",
            },
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
        },
      },
    ],
  ];

  let hd;

  if (tar == "cat") {
    hd = cat_hd;
  } else if (tar == "kwd") {
    hd = kwd_hd;
  }

  XLSX.utils.sheet_add_aoa(ws, hd);

  //Starting in the second row to avoid overriding and skipping headers
  XLSX.utils.sheet_add_json(ws, json, { origin: "A2", skipHeader: true });

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  autoFitColumns(ws);

  XLSX.writeFile(wb, myFile);
}
