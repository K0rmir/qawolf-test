// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const converter = require('json-2-csv');
const fs = require("node:fs");


async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
// empty array that article data will be pushed into //
  const articlesArr = [];

  // go to Hacker News
  console.log("Navigating to page...")
  await page.goto("https://news.ycombinator.com", {timeout: 2 * 60 * 1000});
  console.log("Landed on Hacker News! Getting top 10 articles...")

  // get element where each article is contained in table row //
  const articles = page.locator('tr.athing')

   for (let i=0; i <= 9; i++) {
    const articleElement = articles.nth(i);
    const titleElement = articleElement.locator('td.title span.titleline a').nth(0)
    const title = await titleElement.textContent();   
    const url = await titleElement.getAttribute('href');   
    const article = {
      Title: title,
      Url: url
    }
    articlesArr.push(article)
  } 

  // ^ As noted here (https://playwright.dev/docs/other-locators), it is recommended to use user-visible locators like text or accessible role instead of CSS classes. //
  // However, given the structure of the HTML on the hacker news website, it was difficult to use getByRole as it mostly uses table data & rows and span elements of which are invalid arguments. //
  // I experimented with arguments such as 'table' and 'row', however didn't have luck with these. I'd welcome refactoring this in the future should I be exposed to more efficient way however I'm happy with this implementation for now. //

  await browser.close();
  console.log("Articles got! Compiling and downloading...")
  // Convert articles array into csv //
  const articlesCsv = converter.json2csv(articlesArr)


  function downloadArticleCsv() {
    fs.writeFile('articles.csv', articlesCsv, err => {
      if (err) {
        console.log("!Failed to download articles!")
      } else {
        console.log("Articles download successfully!")
      }
    })   
  }

  downloadArticleCsv();


}





(async () => {
  await saveHackerNewsArticles();
})();
