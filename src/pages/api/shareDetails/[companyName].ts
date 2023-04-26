import { NextApiRequest, NextApiResponse } from "next";

import { JSDOM } from "jsdom";

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
    highLowSpan?.textContent?.split("\n")[1].split("-")[0].trim()
  );
  const low = Number(
    highLowSpan?.textContent?.split("\n")[1].split("-")[1].trim()
  );

  const halfYearAvgSpan = document.querySelector(
    "body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(2) > div.col-md-7.col-sm-7.col-xs-12 > div > div.col-md-12 > div:nth-child(3) > span.padding-second.pd-sm-fx"
  );

  const halfYearAvgData = Number(
    halfYearAvgSpan?.textContent?.split("\n")[1].trim()
  );

  const nameSpan = document.querySelector("body > div:nth-child(3) > div > section.main-content > div:nth-child(3) > div > div > div > div.company-list > div:nth-child(1) > div > h1");

  const companyName = nameSpan?.textContent;

  res.status(200).json({ high, low, halfYearAvgData, companyName });
};

export default reqHandler;
