import axiosBase, { AxiosInstance } from 'axios';

// ============================================
// axios インスタンスを生成する
// ============================================
const APIKEY = process.env.REACT_APP_PUBG_API_KEY;
const HOSTNAME = 'https://api.pubg.com';
const axios: AxiosInstance = axiosBase.create({
  baseURL: HOSTNAME,
  headers: {
    Authorization: APIKEY,
    Accept: 'application/json'
    // Accept: 'application/vnd.api+json' // <= 公式docはこれだけどなぜかこれだととれない。。
  }
});

interface StatsData {
  matcheDate?    : any;
  matcheTime?    : string;
  gameMode?      : string;
  mapName?       : string;
  rosters?       : number;
  winPlace?      : number;
  damageDealt?   : number;
  kills?         : number;
  telemetryURL?  : string;
}

export class PubgAPI {

  // get API
  // ============================================
  public getAPI = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res;
    } catch (error) {
      console.error('getAPI ERROR!! =>' + error);
    }
    return null;
  }

  // Players API から match id を取り出して、Matchs API 叩いて各種データを取り出す
  // ============================================
  public getMatches = async (userID: string, playingStartTime?: Date, urumuchiState?: boolean) => {
    let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + userID);
    // console.log(playerDataGetResult);
    let playerMatchData = playerDataGetResult!.data.data[0].relationships.matches.data;
    // console.log(playerMatchData.length);

    // マッチの数が50より足りないとエラーになるので
    const maxLength = playerMatchData.length < 50 ? playerMatchData.length : 50;
    // console.log(maxLength);

    // 適当に50試合の matches URL 取得してリスト化
    // =====================================================
    let matchesReqestURL = [];
    for (let x = 0; x < maxLength; x++) {
      let matchID = playerMatchData[x].id;
      matchesReqestURL.push('/shards/steam/matches/' + matchID);
    }

    // 50試合のうち、トレモ除いた試合のJSONデータにする
    // =====================================================
    let matcheList: any = [];
    for (let y = 0; y < matchesReqestURL.length; y++) {
      let matcheDataGetResult = await this.getAPI(matchesReqestURL[y]);
      // console.log(matcheDataGetResult)
      if(matcheDataGetResult !== null){
        // ただのGETにも対応
        if(playingStartTime !== undefined){
          // PlayingStartTimeをマッチ時間の差分みて、開始移行のデータがあればリスト化する
          const startTime = new Date(playingStartTime);
          let matchTime = new Date(matcheDataGetResult.data.data.attributes.createdAt);
          // console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          // console.log("startTime    => " + startTime)
          // console.log("APIdataTime => " + matcheDataGetResult.data.data.attributes.createdAt)

          if (urumuchiState === true) { // ウルムチ設定のときはマッチ時間も +1h して日本時間にして差分計算
            let shift = new Date(matchTime.getTime()+9*60*60*1000).toISOString().split('.')[0];
            console.log("matchTime +1h => " + shift)
            let urumuchiTime = new Date(shift);
            // _playingStartTime と last match の差分計算（ms）して、試合データがあれば取得
            const diffTime = startTime.getTime() - urumuchiTime.getTime();
            var diffMS = Math.floor(diffTime / (1000));
            // console.log(diffMS);
            if(diffMS < 0){
              if (matcheDataGetResult.data.data.attributes.mapName !== "Range_Main") { // トレモ除く
                matcheList.push(matcheDataGetResult.data);
              }
            } else {
              console.log("該当マッチなし");
            }
          } else {
            // _playingStartTime と last match の差分計算（ms）して、試合データがあれば取得
            const diffTime = startTime.getTime() - matchTime.getTime();
            var diffMS2 = Math.floor(diffTime / (1000));
            // console.log(diffMS2);
            if(diffMS2 < 0){
              if (matcheDataGetResult.data.data.attributes.mapName !== "Range_Main") { // トレモ除く
                matcheList.push(matcheDataGetResult.data);
              }
            } else {
              console.log("該当マッチなし");
            }
          }
        } else {
          if (matcheDataGetResult.data.data.attributes.mapName !== "Range_Main") { // トレモ除く
            matcheList.push(matcheDataGetResult.data);
          }
        }
      }
    }
    // console.log(matcheList);

    // 各種データを配列にまとめる
    // =====================================================
    let statsDataList: any = {};
    statsDataList["data"] = [];
    let telemetryList = [];

    // マッチデータ
    for (let y = 0; y < matcheList.length; y++) {
      let statsData: StatsData = {};
      let createdAt   = new Date(matcheList[y].data.attributes.createdAt);
      let createdAtDate  = createdAt.toLocaleString('ja-JP').split(/\s/); // JSTに変換して日時で分ける
      let zeroFormat = createdAtDate[0].split("/");
      zeroFormat[1] = ("0"+zeroFormat[1]).slice(-2); // 月の0埋め
      zeroFormat[2] = ("0"+zeroFormat[2]).slice(-2); // 日の0埋め
      statsData.matcheDate = zeroFormat[0] + "/" + zeroFormat[1] + "/" + zeroFormat[2];
      statsData.matcheTime  = createdAtDate[1];
      statsData.gameMode    = matcheList[y].data.attributes.gameMode;
      statsData.mapName     = matcheList[y].data.attributes.mapName;
      statsData.rosters     = matcheList[y].data.relationships.rosters.data.length;
      

      let matchsDetaDetail = matcheList[y].included;
       // 個人データ
      for (let z = 0; z < matchsDetaDetail.length; z++) {
        if(matchsDetaDetail[z].type === "participant") {
          if(matchsDetaDetail[z].attributes.stats.name === userID) {
            statsData.winPlace     = matchsDetaDetail[z].attributes.stats.winPlace;
            statsData.damageDealt  = Math.round(matchsDetaDetail[z].attributes.stats.damageDealt * 10) / 10;
            statsData.kills        = matchsDetaDetail[z].attributes.stats.kills;
          }
        }
        // stock telemetry data json
        // it have to stock big JSON and perse, so next time
        if(matchsDetaDetail[z].type === "asset") {
          if(matchsDetaDetail[z].attributes.URL !== null) {
            telemetryList.push(matchsDetaDetail[z].attributes.URL);
            statsData.telemetryURL = matchsDetaDetail[z].attributes.URL;
          }
        }
      }
      statsDataList.data[y] = statsData;
      // console.log(JSON.stringify(matcheList[y],undefined,1));
      // console.log(JSON.stringify(matchsDetaDetail,undefined,1));
    }
    // 日付を最後に追加
    statsDataList.playedDate = statsDataList.data[matcheList.length -1].matcheDate;

    // console.log(JSON.stringify(telemetryList,undefined,1));
    // console.log(statsDataList);
    console.log("return!!");
    return [statsDataList, telemetryList];
  }

  // Players API から accountid を取り出して、lifetimeStatsAPI 叩いて通年のKDデータを取り出す
  // ============================================
  public getSeasonStats = async (userID: string, gameMode: string) => {
    try {
      // シーズンじゃなく、トータルの K/D はこれでとれてる
      // アカウントID取ってくるやつ
      // 短時間に複数回（1分間に10回以上叩くと 429 error で失敗する）
      let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + userID);
  
      let accountID = playerDataGetResult!.data.data[0].id;
      console.log(accountID);
      // ライフタイムスタッツ取る
      let reqURL = '/shards/steam/players/' + accountID + '/seasons/lifetime';
      // console.log(reqURL);
      let lifetimeData = await this.getAPI(reqURL);
      let kd = (lifetimeData!.data.data.attributes.gameModeStats[gameMode]['kills'] / lifetimeData!.data.data.attributes.gameModeStats[gameMode]['losses']).toFixed(2);
      // console.log(userID +  ' => ' + kd);
      return kd;
     } catch( reason ) {
      console.log("getSeasonStats => " +  reason);
    }
  }
}

