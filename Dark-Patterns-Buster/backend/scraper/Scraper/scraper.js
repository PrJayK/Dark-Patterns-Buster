const path=require('path')
module.exports= class Scraper {
  #pageSegment

  constructor(pageSegment) {
    this.pageSegment = pageSegment;
  }

 async scrapingAndSegmentPage(
    page,
    url,
    pathToScreenshotDir,
    waitTimeSec,
    viewport= { width: 1440, height: 900 }
  ){
    await page.goto(url, {
      timeout: 0,
    });
    await page.setViewport(viewport);
    await page.waitForTimeout(waitTimeSec * 1000);
    const texts = await this.pageSegment.pageSegmentation(await page.$('html'));
    await this.#takeScreenShot(
      page,
      path.join(pathToScreenshotDir, `whole-page.png`)
    );
    return texts;
  }

 async #takeScreenShot(
    page,
    pathToScreenshot
  ) {
    await page.screenshot({ path: pathToScreenshot, fullPage: true });
  }
}