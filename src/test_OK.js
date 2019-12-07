// node src/test_OK.js
// でうごいたデモ

const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({headless: true}); // false にするとChrome起動して使える
  const page = await browser.newPage();
  await page.goto(
    'https://telemetry-cdn.playbattlegrounds.com/bluehole-pubg/steam/2019/12/03/16/20/ca39b167-15e8-11ea-86f7-0a586468b3f2-telemetry.json',
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
          console.log("LOSE => " + item.killer.name);
          return true
        }
      }
    }
    // console.log("該当なし");
    return false
  });
  console.log(fightLog);

  await browser.close();
})();