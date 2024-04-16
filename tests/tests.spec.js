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

// Considered adding tests for converting & writing to csv and sending emails via nodemailer however upon looking into it I would need another library to mock libraries the script is dependant on (nodemail, json2csv), such as Sinon (https://sinonjs.org/) //
// This is really cool as is something new I didn't know you could do, however it felt slightly out of scope for this task. I am going to be looking into Sinon and similar libraries to learn more about them. //


