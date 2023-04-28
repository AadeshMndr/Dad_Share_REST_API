import { NextApiRequest, NextApiResponse } from "next";


import { JSDOM } from "jsdom";

// import puppeteer from "puppeteer";

// const reqHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const url = `https://www.sharesansar.com/company/${(
//     req.query.companyName as string
//   ).toLocaleLowerCase()}`;

//   //Using puppeteer

//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });

//   const page = await browser.newPage();

//   const responseObj = await page.goto(url);

//   if (!responseObj?.ok() || responseObj === null) {
//     res.status(404).json("Not Found!");
//     return;
//   }

//   const data = await page.evaluate(() => {
//     const companyName = document.querySelector(
//       "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(1) > div > h1"
//     )?.textContent;

//     const highLowSpan = document.querySelector(
//       "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-7.col-sm-7.col-xs-12 > div > div.col-md-12 > div:nth-child(3) > span:nth-child(1)"
//     );

//     const high = Number(
//       highLowSpan?.textContent
//         ?.split("\n")[1]
//         .split("-")[0]
//         .trim()
//         .split("")
//         .filter((char) => char !== ",")
//         .join("")
//     );

//     const low = Number(
//       highLowSpan?.textContent
//         ?.split("\n")[1]
//         .split("-")[1]
//         .trim()
//         .split("")
//         .filter((char) => char !== ",")
//         .join("")
//     );

//     const halfYearAvgSpan = document.querySelector(
//       "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-7.col-sm-7.col-xs-12 > div > div.col-md-12 > div:nth-child(3) > span.padding-second.pd-sm-fx"
//     );

//     const halfYearAvgData = Number(
//       halfYearAvgSpan?.textContent
//         ?.split("\n")[1]
//         .trim()
//         .split("")
//         .filter((char) => char !== ",")
//         .join("")
//     );
    

//     return {
//       high: high || 0,
//       low: low || 0,
//       halfYearAvgData: halfYearAvgData || 0,
//       companyName,
//     };
//   });

//   //going into the Financials Tab

//   await page.waitForSelector("#btn_cqtrreport");

//   await page.evaluate(() => {
//     const a = document.querySelector<HTMLAnchorElement>("#btn_cqtrreport");
//     if (a) {
//       a.click();
//     }
//   });

//   await page.waitForSelector("#keymetrics");

//   const tab1Data = await page.evaluate(() => {
//     const data = Array.from(
//       document.querySelectorAll("#keymetrics > div > table > tbody > tr") || []
//     ).map((elem) => {
//       const text = elem.textContent;

//       return {
//         title: text?.split("\n")[1].trim(),
//         value: text?.split("\n")[2].trim(),
//       };
//     });

//     return data;
//   });

//   const tab2Data = await page.evaluate(() => {
//     const tab = document.querySelector("#keyratios");
//     if (tab !== null) {
//       const rows = document.querySelectorAll(
//         "#keyratios > div > table > tbody > tr"
//       );

//       const data = Array.from(rows).map((elem) => {
//         const text = elem.textContent;

//         return {
//           title: text?.split("\n")[1].trim(),
//           value: text?.split("\n")[2].trim(),
//         };
//       });

//       return data;
//     } else {
//       return [];
//     }
//   });

//   await browser.close();

//   const records: { title: string | undefined; value: string | undefined }[] = [
//     ...tab1Data,
//     ...tab2Data,
//   ];

//   const eps = records.reduce((acc: string | undefined, { title, value }) => {
//     if (
//       title?.toUpperCase() ===
//         "Basic Earnings Per Share(Annualized EPS)".toUpperCase() ||
//       title?.toUpperCase() ===
//         "Earnings Per Share (EPS Annualized -Rs.)".toUpperCase()
//     ) {
//       return value;
//     } else if (
//       title?.toUpperCase().includes("Earnings Per Share".toUpperCase()) &&
//       acc === undefined
//     ) {
//       return value;
//     } else {
//       return acc;
//     }
//   }, undefined);

//   const PE_ratio = records.reduce(
//     (acc: string | undefined, { title, value }) => {
//       if (
//         title?.toUpperCase() === "P/E Ratio".toUpperCase() ||
//         title?.toUpperCase() ===
//           "Price to Earning Ratio (PE ratio - times)".toUpperCase()
//       ) {
//         return value;
//       } else if (
//         (title?.toUpperCase().includes("PE ratio".toUpperCase()) ||
//           title?.toUpperCase().includes("P/E ratio".toUpperCase())) &&
//         acc === undefined
//       ) {
//         return value;
//       } else {
//         return acc;
//       }
//     },
//     undefined
//   );

//   const actualEps = eps
//     ? Number(eps
//         .trim()
//         .split("")
//         .filter((char) => char !== ",")
//         .join(""))
//     : 0;

//   const actualPE_ratio = PE_ratio
//     ? Number(PE_ratio.trim()
//         .split("")
//         .filter((char) => char !== ",")
//         .join(""))
//     : 0;

//   res.status(200).json({ ...data, eps: actualEps, PE_ratio: actualPE_ratio });
// };

// export default reqHandler;


const reqHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `https://www.sharesansar.com/company/${(
    req.query.companyName as string
  ).toLocaleLowerCase()}`;

  const response = await fetch(url);

  if (!response.ok) {
    res.status(404).json("Not Found!");
    return;
  }

  const html = await response.text();

  const dom = new JSDOM(html);

  const document = dom.window.document;

  const highLowSpan = document.querySelector(
    "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-7.col-sm-7.col-xs-12 > div > div.col-md-12 > div:nth-child(3) > span:nth-child(1)"
  );

  const high = Number(
    highLowSpan?.textContent?.split("\n")[1].split("-")[0].trim().split("").filter( (char) => char !== "," ).join("")
  );

  const low = Number(
    highLowSpan?.textContent?.split("\n")[1].split("-")[1].trim().split("").filter( (char) => char !== "," ).join("")
  );

  const halfYearAvgSpan = document.querySelector(
    "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-7.col-sm-7.col-xs-12 > div > div.col-md-12 > div:nth-child(3) > span.padding-second.pd-sm-fx"
  );

  const halfYearAvgData = Number(
    halfYearAvgSpan?.textContent?.split("\n")[1].trim().split("").filter( (char) => char !== "," ).join("")
  );

  const nameSpan = document.querySelector("body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(1) > div > h1");

  const companyName = nameSpan?.textContent;

  res.status(200).json({
    high: high || 0,
    low: low || 0,
    halfYearAvgData: halfYearAvgData || 0,
    companyName,
  });
}

export default reqHandler;
