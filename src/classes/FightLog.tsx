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
      // const res = await axios.get('/telemetry/test/testttttttttt!!!!!');
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

  public getTelemetryData = async (urls: any) => {
    let fightLogList: any = [];
    for (let z = 0; z < urls.length; z++) {
      let puppdata = await this.goPuppeteer(urls[z])
      if(puppdata !== null) {
        let killlog: any = Object.values(puppdata.data)[0];
        for (let q = 0; q < killlog.length; q++) {
          if(killlog[q].win){
            const pubgApi = new PubgAPI();
            pubgApi.getSeasonStats(killlog[q].win)
            .then((value: any) => {
              // console.log(value);
              fightLogList[q]['win'] = killlog[q].win;
              fightLogList[q]['kd'] = value;
            }, (reason: any) => {
              console.log("Can not getSeasonStats Error => " + reason);
            });
          } else if (killlog[q].lose) {
            const pubgApi = new PubgAPI();
            pubgApi.getSeasonStats(killlog[q].lose)
            .then((value: any) => {
              // console.log(value);
              fightLogList[q]['lose'] = killlog[q].lose;
              fightLogList[q]['kd'] = value;
            }, (reason: any) => {
              console.log("Can not getSeasonStats Error => " + reason);
            });
          } else {
            console.log("なんかなぞのもの");
          }
        }
      } else {
        console.log("Cannot got data from Puppeteer! => " + puppdata);
      }
    }
    console.log(fightLogList);
    console.log("Get success => " + fightLogList.length + "/" + urls.length);
    return fightLogList;
  }
}