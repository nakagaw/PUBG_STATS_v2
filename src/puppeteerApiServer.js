
const express = require('express')
const puppeteer = require('puppeteer');

const app = express()

// CORSを許可する
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api', (req, res) => {
  res.send('request is => ' + req)
})

app.get('/telemetry/:telemetryURL', async (req, res) => {
  const url = decodeURIComponent(req.params.telemetryURL);
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

  res.send(fightLog);
  await browser.close();
})

app.get('*', (req, res) => {
  res.status(404).send('Not Fount 404')
})

app.listen(4444, () => console.log(`Start puppeteer api server !!!!`))