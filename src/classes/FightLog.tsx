import { PubgAPI } from './PubgAPI';
import axiosBase, { AxiosInstance } from 'axios';
const HOSTNAME =  'http://localhost:4649';
// const HOSTNAME = 'https://us-central1-my-pubg-stats.cloudfunctions.net';
const axios: AxiosInstance = axiosBase.create({
  baseURL: HOSTNAME
});

export class FightLog {

  // Puppeteer
  // ============================================
  public goPuppeteer = async (url: string) => {
    try {
      console.log(url)
      const encodeURL = encodeURIComponent(url);
      const res = await axios.get('/telemetry/get/' + encodeURL);
      return res;
    } catch (error) {
      if (!error.response) {
        // network error
        console.log("Puppeteerをまててない =>" + error);
      } else {
        console.error('Puppeteer ERROR!! =>' + error);
      }
    }
    return null;
  }

  // puppeteer server に axios で urlリストでリクエストして、
  // スクレイピングしてとってきた 敵のIDリストで pubg api getSeasonStats 叩いて
  // KD を計算して配列にして返すやつ
  public getTelemetryData = async (urls: any) => {
    let fightLogWithKD: any = {};
    for (let z = 0; z < urls.length; z++) {
      let puppdata = await this.goPuppeteer(urls[z]);
      if(puppdata !== null) {
        let fightLog: any = {};
        fightLog = Object.values(puppdata.data)[0];
        // console.log(fightLog);
        const gameMode = fightLog[0].gameMode;
        for (let q = 0; q < fightLog.length; q++) {
          let winOrLose: string = Object.keys(fightLog[q])[0];
          if( winOrLose === "win" || winOrLose === "lose"){
            let userID: any = Object.values(fightLog[q]);
            const pubgApi = new PubgAPI();
            fightLog[q]["kd"] = await pubgApi.getSeasonStats(userID, gameMode)
          }
        }
        // gameModeは削除して、url ごとにオブジェクト化
        fightLog.shift();
        fightLogWithKD[urls[z]] = fightLog;
      } else {
        console.log("Cannot got data from Puppeteer! => " + puppdata);
      }
    }
    // console.log(fightLogWithKD);
    return fightLogWithKD;
  }
}