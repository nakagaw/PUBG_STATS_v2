// puppeteer をつかって、telemetry の JSONデータをスクレイピングするやつ
const express = require('express')
const cors = require('cors');
const pptrFirefox = require('puppeteer-firefox');
// const puppeteer = require('puppeteer');

const app = express()

const userID = "UG_boy";

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/telemetry/get/:telemetryURL', async (req, res, next) => {
  try {
    const url = decodeURIComponent(req.params.telemetryURL);
    console.log(url)
    
    // URLじゃなかったときのエラーハンドリング必要
    // const browser = await puppeteer.launch({
    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--disable-gpu',
    //     '--disable-web-security',
    //     // '--no-first-run',
    //     // '--no-zygote',
    //     // '--single-process',
    //     // '-–disable-dev-shm-usage',
    //   ],
    //   devtools: false,
    //   headless: false, // false にするとChrome起動して使える
    // });
    const browser = await pptrFirefox.launch();
    const page = await browser.newPage();
    console.log(". loading");
    // たまにキャッチできないの謎・・
    // try {
      await page.goto(
        url,
        {
          waitUntil: 'load',
          timeout: 0, // JSONがでかすぎるからタイムアウトなし
          // それでも NetworkError でるときブラウザのタイムアウトも注意 => https://scrapbox.io/kadoyau/%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%81%AE%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%A2%E3%82%A6%E3%83%88%E3%81%AF%E4%BD%95%E7%A7%92%EF%BC%9F
        }
      );
      console.log(".. will get content");
    // } catch (error) {
    //   console.log(error);
    //   await browser.close();
    // }

    // 開いたページの pre タグ内にあるJSONテキストを取得
    const data = await page.$eval('pre', selector => {
      return JSON.parse(selector.textContent);
    })
    console.log("... got content");

    let fightLog = {};
    fightLog[req.params.telemetryURL] = Object.values(data).filter((item) => {
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
              // console.log("LOSE => SelfKill...");
              namelist["lose"] = "SelfKill";
              return namelist;
            } else {
              // console.log("WIN  => " + item.victim.name);
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
              // console.log("LOSE => BlueZone");
              namelist["lose"] = "BlueZone";
              return namelist;
            } else {
              // console.log("LOSE => " + item.killer.name);
              namelist["lose"] = item.killer.name;
              return namelist;
            }
          }
        }
        return null
      }
    });
    const gameMode = { gameMode : Object.values(data)[0].MatchId.split('.')[5] };
    fightLog[req.params.telemetryURL].unshift(gameMode);
    console.log(fightLog);

    res.send(fightLog);
    await browser.close();
    console.log(".... Successful! Close browser");
  } catch (error) {
    console.log("Express error => "+ error);
    next(error);
  }
})

app.listen(4649, () => console.log(`Start puppeteer api server !!!!`))