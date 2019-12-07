import axiosBase, { AxiosInstance } from 'axios';
const HOSTNAME =  'http://localhost:4444';
const axios: AxiosInstance = axiosBase.create({
  baseURL: HOSTNAME,
});

export class JsonParse {

  // Puppeteer
  // ============================================
  public goPuppeteer = async (url: string) => {
    try {
      console.log(url)
      const encodeURL = encodeURIComponent(url);
      const res = await axios.get('/telemetry/' + encodeURL);
      return res;
    } catch (error) {
      console.error('getJSON ERROR!! =>' + error);
    }
    return null;
  }

  public getTelemetryData = async () => {
    const _todayTelemetryData = localStorage.getItem('_pubgApiTelemetryData')!;
    const url = JSON.parse(_todayTelemetryData);
    let test = await this.goPuppeteer(url[0])
    console.log(test);
  }

}

