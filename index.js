

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function saveHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const articlesArr = [];


  // go to Hacker News
  console.log("Navigating to page...")
  await page.goto("https://news.ycombinator.com", {timeout: 2 * 60 * 1000});
  console.log("Landed! Getting article titles...")

  // get element of article title names //
  const articles = page.locator('tr.athing')

   for (let i=0; i < 10; i++) {
    const articleElement = articles.nth(i);
    const titleElement = articleElement.locator('td.title span.titleline a').nth(0)
    const title = await titleElement.textContent();
    console.log(title)
    const url = await titleElement.getAttribute('href');
    console.log(url)
    const article = {
      Title: title,
      Url: url
    }
    articlesArr.push(article)
    console.log(articles)
  } 


  console.log(articlesArr)
  await browser.close();
}



(async () => {
  await saveHackerNewsArticles();
})();
