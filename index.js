// @ts-check

// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");
const converter = require('json-2-csv');
const fs = require("node:fs");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
require('dotenv').config();
require("process");

async function saveHackerNewsArticles() {
  // launch browser  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
// empty array that article data will be pushed into //
  const articlesArr = [];

  // go to Hacker News
  console.log("Navigating to page...")
  try {
    await page.goto("https://news.ycombinator.com", {timeout: 2 * 60 * 1000});
  } catch(error) {
    if (error.name === 'TimeoutError' || error.message.includes('NetworkError')) {
      console.error("Failed to establish connection to Hacker News. (Network Error)");
      throw new Error ("Failed to establish connection. Aborting...")
    }
  }
 
  console.log("Connected to Hacker News! Getting top 10 articles...")

  // get element where each article is contained in table row //
  const articles = page.locator('tr.athing')

  try {
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
  }} catch(err) {
    console.error(err)
    throw new Error("Failed to scrape article data. Aborting...")
  }  

  // ^ As noted here (https://playwright.dev/docs/other-locators), it is recommended to use user-visible locators like text or accessible role instead of CSS classes. //
  // However, given the structure of the HTML on the hacker news website, it was difficult to use getByRole as it mostly uses table data & rows and span elements, which are invalid arguments. //
  // I experimented with arguments such as 'table' and 'row', however didn't have luck with these. I'd welcome refactoring this in the future should I be exposed to a more efficient way however I'm happy with this implementation for now. //

  await browser.close();

  // Convert articles array into csv //
  console.log("Articles got! Converting to CSV and writing to file...")
  const articlesCsv = converter.json2csv(articlesArr)

// Create csv file //
  function downloadArticleCsv() {
    try {
      fs.writeFile('HackerNewsArticles.csv', articlesCsv, err => {
        if (err) {
          throw new Error("Failed to write articles to file! Aborting...")
        } else {
          console.log("Articles successfully written to file! Sending email...")
        }
      })
    } catch(err) {
      console.error("Failed to write articles to file!")
    }  
  }

  downloadArticleCsv();

  // Send email with articles csv //
// Define the HTML content of the email //
  const html = `
    <h2>Good Morning!</h2>
    <p> See attached this mornings top 10 Hacker News Articles</p>
  `
// Function to send articles email to gmail account //
  async function sendArticles() {
// configure where the email is sent from (https://support.google.com/mail/answer/7104828?hl=en&ref_topic=7280141&sjid=5865078254559136309-EU) //
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
// function to send email //
    const message = await transporter.sendMail({
      from: `Kormir <kormir.dev@gmail.com>`,
      to: 'kormir.dev@gmail.com', // change this line to your email address to recieve email & csv attachment.
      subject: 'Hacker News Daily',
      html: html,
      attachments: [{
        filename: 'Hacker New Articles.csv',
        path: './HackerNewsArticles.csv'
      }]
    });
    console.log("Article Email sent! Check your indox. " + message.messageId)
  }
  
  sendArticles()
}

(async () => {
  await saveHackerNewsArticles();
})();

// Automated scheduleing to recieve emails each day //
// Currently set to run the entire script at 8am each day. //
// Edit schedule using https://crontab.guru/#0_8_*_*_* //

// cron.schedule('0 8 * * *', () => {
//   (async () => {
//     await saveHackerNewsArticles();
//   })();
//   console.log("CronJob Ran Successfully!")    
// });


// Ideally, with the cron job included in the script, it would be hosted on a VPS for full automation. // 





