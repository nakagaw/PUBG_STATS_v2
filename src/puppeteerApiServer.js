
const express = require('express')
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express()

const userID = "UG_boy";

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/telemetry/get/:telemetryURL', async (req, res) => {
  const url = decodeURIComponent(req.params.telemetryURL);
  console.log(url)

  // URLじゃなかったときのエラーハンドリング必要
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '-–disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
    headless: true, // false にするとChrome起動して使える
    
    });
  const page = await browser.newPage();
  await page.goto(
    url,
    {
      waitUntil: "domcontentloaded", // DOM読み込み完了を待つ
      timeout: 99999999, // JSONがでかすぎるからタイムアウト伸ばさないと止まる。。
    }
  );

  // 開いたページの pre タグ内にあるJSONテキストを取得
  const obj = await page.$eval('pre', selector => {
    return selector.textContent
  })
  const data = JSON.parse(obj);

  let fightLog = {};
  fightLog[req.params.telemetryURL] = Object.values(data).filter((item, index) => {
    if(item.killer) {
      // 倒した相手
      if (item.killer.name === userID) {
        if (item.victim !== undefined) {
          // console.log(item);
          return true
        }
      }
    }
    if (item.victim) {
      // 倒された相手
      if (item.victim.name === userID) {
        if (item.killer !== undefined) {
          // if (item.killer == null) { // Bluezoneのとき
          //   console.log("LOSE => BlueZone");
          // } else {
          //   console.log(item);
          // }
          return true
        }
      }
    }
    // console.log("該当なし");
    return false
  })
  .map((item) => { // さらに name を抽出する
    let namelist = {};
    if(item.killer) {
      // 倒した相手
      if (item.killer.name === userID) {
        if (item.victim !== undefined) {
          if (item.victim.name === userID) {
            console.log("LOSE => SelfKill...");
            namelist["lose"] = "SelfKill";
            return namelist;
          } else {
            console.log("WIN  => " + item.victim.name);
            namelist["win"] = item.victim.name;
            return namelist;
          }
        }
      }
    }
    if (item.victim) {
      // 倒された相手
      if (item.victim.name === userID) {
        if (item.killer !== undefined) {
          if (item.killer == null) {
            console.log("LOSE => BlueZone");
            namelist["lose"] = "BlueZone";
            return namelist;
          } else {
            console.log("LOSE => " + item.killer.name);
            namelist["lose"] = item.killer.name;
            return namelist;
          }
        }
      }
      return null
    }
  });

  res.status(202).send(fightLog);
  await browser.close();
})

app.listen(4649, () => console.log(`Start puppeteer api server !!!!`))