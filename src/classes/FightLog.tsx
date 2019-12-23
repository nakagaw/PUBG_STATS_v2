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
        const seasonID = fightLog[1].seasonID;
        for (let q = 0; q < fightLog.length; q++) {
          let winOrLose: string = Object.keys(fightLog[q])[0];
          if( winOrLose === "win" || winOrLose === "lose"){
            let userID: string = Object.values(fightLog[q]).toString();
            if (userID === "SelfKill" || userID === "BlueZone") {
              console.log(userID);
              fightLog[q]["kd"] = null;
            } else {
              console.log(userID);
              const pubgApi = new PubgAPI();
              fightLog[q]["kd"] = await pubgApi.getSeasonStats(userID, gameMode, seasonID);
            }
          }
        }
        fightLog.splice(0,2); // gameMode と sasonID は削除
        console.log(fightLog);
        fightLogWithKD[urls[z]] = fightLog; // url ごとにオブジェクト化
      } else {
        console.log("Cannot got data from Puppeteer! => " + puppdata);
      }
    }
    console.log(fightLogWithKD);
    return fightLogWithKD;
  }
}