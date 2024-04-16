// const { default: test } = require("node:test");
const { test, expect } = require("playwright/test");

test('has title', async ({ page }) => {
    await page.goto('https://news.ycombinator.com');
    await expect(page).toHaveTitle(/Hacker News/);
});


// Test each article for CSS class 'athing' //
test('article title', async ({page}) => {
    await page.goto('https://news.ycombinator.com');

//  creates an array of all tr elements on the page using .all() //
   const articlesArr = await page.locator('tr.athing').all();

// loop through each tr (article) and expect each element (tr) to have CSS class 'athing' //
   for (const article of articlesArr) {
    await expect(article).toHaveClass('athing');
   }
});



