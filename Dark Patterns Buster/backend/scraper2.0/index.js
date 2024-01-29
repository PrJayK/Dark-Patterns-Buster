const puppeteer=require('puppeteer-extra')
const {Parser}=require('@json2csv/plainjs')
const fs = require('fs');
var  ID=0;
let RANDOM_ID_FORMAT=`dark_patternsbuster${ID}`
const IGNORE_ELEMENTS=['SCRIPT','NOSCRIPT','STYLE','BR']
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
async function Scraper(url){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url,{ timeout: 60000 });
    await page.screenshot({ path: './page.png', fullPage: 'true' });
    const body=await page.$('body')
    const child=await getChild(page,body)
    const texts=await Scrapy(page,body)
    console.log(texts)
    await browser.close()
    return texts
}
async function Scrapy(page,element){
    let data=[]
    if(!element){
        return []
    }
    else{
        if(!(await isIgnoredElement(element))){
            if(await getNodeType(page,element)==3){
                const info={
                    id:await getId(element), //id to text node is given 20 by default
                    text: (await getTextContent(element)).trim()
                }
                return [info]
            }
        const parent=element
        const children=await getChild(page,element);
        for(const child of children){
            if(await getNodeType(page,child)===3){
                const info={
                    id: await getId(page,parent),
                    text:(await getTextContent(child)).trim()
                }
                data.push(info)
            }
            data=data.concat(await Scrapy(page,child))
        }
        }
    }
    return data
}
async function getTextContent(element){
    const text = await (await element?.getProperty('textContent'))?.jsonValue();
    return text
}
async function getChild(page,element){
    if(!element){
        return []
    }
    const list=await page.evaluateHandle((e)=>e.childNodes,element)
    const properties=await list.getProperties()  
    const children=[]
    for(const property of properties.values() )  {
        const element=property.asElement()
        children.push(element)
    }
    return children
}
async function isIgnoredElement(element){
     const tagName=await getTagName(element)
     return typeof tagName === 'string' && IGNORE_ELEMENTS.includes(tagName.toUpperCase());

}
async function getNodeType(page,element){
    const nodetype=await page.evaluate((e)=>{return e.nodeType},element)
    return nodetype
}
async function getId(page,element){
 let id=await page.evaluate((e)=>e.id,element)
 if(!id){
    id=`dark-patterns-buster-${ID}`// random id given to elements with no id
    ID=ID+1
 }
 return id
}
async function getTagName(element){
    return await (await element?.getProperty('tagName'))?.jsonValue();
} 
async function fileConverter(){
const jsonFile=  await Scraper("https://www.flipkart.com/search?q=google&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=off&as=off")
const parser = new Parser();
const cleanFile=fileCleaner(jsonFile)
const csv = parser.parse(cleanFile);
console.log(csv);
const filePath = 'output.csv';
fs.writeFile(filePath, csv, 'utf8', (err) => {
  if (err) {
    console.error('Error writing CSV file:', err);
  } else {
    console.log(`CSV file saved successfully at ${filePath}`);
  }
})
}
fileConverter()
function fileCleaner(file){
     return file.filter((e)=>e.text!="");
}