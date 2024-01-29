const PageSegment = require('./PageSegment/PageSegmentBase')
const Scraper =require('./Scraper/scraper')
const {createDirIfNotExist}=require('./Scraper/util/directory')
const CRAWLED_DATA_DIR="./crawled-data"
const path =require('path')
const fs =require('fs')
const {formatDate}=require('./Scraper/util/date')
 const puppeteer=require('puppeteer-extra')
 const StealthPlugin = require('puppeteer-extra-plugin-stealth')
 async function Scrape(url,dirToSave){
   puppeteer.use(StealthPlugin())
   const browser=await puppeteer.launch()
  const page= await browser.newPage()
  const pageSegment=new PageSegment( page)
  const scraper=new Scraper(pageSegment)
  const texts=await scraper.scrapingAndSegmentPage(page,url,"./",10)
  const continuousSpaceOverTwoCharactorRule = /\s{2,}/g;
  const textsReplaced = texts
    .map((text) => text.replace(continuousSpaceOverTwoCharactorRule, ' ')) // Replace Continuous Spaces to a Space. Eg. "    " → " "
    .map((text) => text.replace('\n', '')); // Replace New Line("\n") to a Space. Eg. "\n" → " "
    

  console.log(textsReplaced)
  console.log(" \n done ")
  browser.close()
  const tsvHeader = ['page_id', 'text', 'url'].join('\t');
  console.log(textsReplaced[0])
  console.log("\n\n\n")
  const tsvBody = textsReplaced
    .map((text,i) => `${i}\t${text}\t${url}`)
    .join('\n')
  const tsvData = `${tsvHeader}\n${tsvBody}`;
  console.log(tsvData)
  const pathToTsv = path.join(dirToSave, 'page-text.tsv');
    fs.writeFileSync(pathToTsv, tsvData);
    return textsReplaced
 }
 function scrapeMain(url){
  const todayStr = formatDate(new Date());
    const dirToSave = path.join(CRAWLED_DATA_DIR, todayStr);
    createDirIfNotExist(dirToSave);
    return Scrape(url,dirToSave)
 }
 scrapeMain("https://www.alibaba.com/trade/search?spm=a27aq.cp_44.4746171840.91.1a523ccfVDkIDu&categoryId=100009272&SearchText=Tablet+PC+Stands&indexArea=product_en&fsb=y&productId=1600950635755")

