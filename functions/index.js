const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// test
app.get('/test/:text', (req, res) => {
  res.status(200).send('test => ' + req.params.text)
})

app.get('/pupp/:text', async (req, res) => {
  // URLじゃなかったときのエラーハンドリング必要
  const browser = await puppeteer.launch({args: [
    '--no-sandbox',
    '-single-process',
    '--disable-setuid-sandbox'
  ]});
  const page = await browser.newPage();
  await page.goto('https://www.google.com/');
  res.status(200).send('test OK => ' + req.params.text)
  await browser.close();
})

app.get('/get/:url', async (req, res) => {
  const url = decodeURIComponent(req.params.url);
  console.log(url)

  // URLじゃなかったときのエラーハンドリング必要
  const browser = await puppeteer.launch({headless: true}); // false にするとChrome起動して使える
  const page = await browser.newPage();
  await page.goto(
    url,
    {timeout: 900000} // JSONがでかすぎるからタイムアウト伸ばさないと止まる。。
  );
  // 開いたページの pre タグ内にあるJSONテキストを取得
  const obj = await page.$eval('pre', selector => {
    return selector.textContent
  })
  const data = JSON.parse(obj);

  let fightLog = Object.values(data).filter((item, index) => {
    if(item.killer) {
      // 倒した相手
      if (item.killer.name === "UG_boy") {
        if (item.victim !== undefined) {
          console.log("WIN  => " + item.victim.name);
          return true
        }
      }
    }
    if (item.victim) {
      // 倒された相手
      if (item.victim.name === "UG_boy") {
        if (item.killer !== undefined) {
          if (item.killer == null) { // Bluezoneのとき
            console.log("LOSE => BlueZone");
          } else {
            console.log("LOSE => " + item.killer.name);
          }
          return true
        }
      }
    }
    // console.log("該当なし");
    return false
  });

  res.status(202).send(fightLog);
  await browser.close();
})

// https://firebase.google.com/docs/functions/manage-functions?hl=ja#set_runtime_options
const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '2GB'
}

// Expose Express API as a single Cloud Function:
exports.telemetry = functions
.runWith(runtimeOpts)
.https.onRequest(app);