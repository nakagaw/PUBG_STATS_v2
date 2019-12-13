import axiosBase, { AxiosInstance } from 'axios';
const HOSTNAME =  'http://localhost:4649';
// const HOSTNAME = 'https://us-central1-my-pubg-stats.cloudfunctions.net';
const axios: AxiosInstance = axiosBase.create({
  baseURL: HOSTNAME,
});

export class FightLog {

  // Puppeteer
  // ============================================
  public goPuppeteer = async (url: string) => {
    try {
      // console.log(url)
      const encodeURL = encodeURIComponent(url);
      const res = await axios.get('/telemetry/get/' + encodeURL);
      // const res = await axios.get('/telemetry/test/testttttttttt!!!!!');
      return res;
    } catch (error) {
      console.error('getJSON ERROR!! =>' + error);
    }
    return null;
  }

  // シングルモード
  // public getTelemetryData = async (urls: any) => {
  //   let telemetryDataList: any = [];
  //   let puppdata = await this.goPuppeteer('https://telemetry-cdn.playbattlegrounds.com/bluehole-pubg/steam/2019/12/10/16/01/470a73ef-1b66-11ea-a333-8e59c46d5f1a-telemetry.json')
  //   if(puppdata !== null) {
  //     telemetryDataList.push(puppdata.data);
  //   } else {
  //     console.log("Cannot got data from Puppeteer!");
  //   }

  //   console.log(telemetryDataList);
  //   return telemetryDataList;
  // }

  public getTelemetryData = async (urls: any) => {
    let telemetryDataList: any = [];
    for (let z = 0; z < urls.length; z++) {
      let puppdata = await this.goPuppeteer(urls[z])
      if(puppdata !== null) {
        telemetryDataList.push(puppdata.data);
      } else {
        console.log("Cannot got data from Puppeteer! => " + puppdata);
      }
    }
    console.log("Get success => " + telemetryDataList.length + "/" + urls.length);
    return telemetryDataList;
  }

}

