import type { NextApiRequest, NextApiResponse } from 'next'
import { JSDOM } from "jsdom";

import { URL } from "@/pages/index";
import ShareData from '@/models/ShareData';

const reqHandler = async (req : NextApiRequest, res: NextApiResponse) => {
    const response = await fetch(URL)

    if (!response.ok){
        res.status(404).json("Not Found!");
        return;
    }

    const html = await response.text();

    const dom = new JSDOM(html);

    const document = dom.window.document;

    const datas: ShareData[] = [];

    const rows = Array.from(document.querySelectorAll("#headFixed > tbody > tr"));

    rows.forEach( (row) =>{
        const cells = Array.from(row.children) as HTMLTableCellElement[];

        const [ _, name, LTP, pointChange, percentageChange, open, high, low, volume, prevClose ] = cells.map( (cell) => cell.textContent?.trim() ); 

        const data = new ShareData( name!, convertToNumber(LTP), convertToNumber(pointChange), convertToNumber(percentageChange), convertToNumber(open), convertToNumber(high), convertToNumber(low), convertToNumber(volume), convertToNumber(prevClose) );

        datas.push(data);
    } );

    res.status(200).json(datas);
}

export default reqHandler;

const convertToNumber = (text: string | undefined): number => {
    if (text !== undefined){
        const arr = text.split("");

        while(arr.some( (elem) => elem === "," )){
            let index = arr.indexOf(",");
            arr.splice(index, 1);
        }

        return Number(arr.join(""));
    } else {
        return NaN;
    }
}