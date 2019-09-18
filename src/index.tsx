import * as React from 'react';
import { render } from 'react-dom';
import Root from './components/Root';

render(
  (<Root/>),
  document.querySelector('#app')
);


// const env = process.env;
// const APIKEY = env.PUBG_API_KEY;
// const USERNAME = 'your PUBG ID';
// const HOSTNAME = 'http://api.pubg.com';

// // axios を require してインスタンスを生成する
// const axiosBase = require('axios');
// const axios = axiosBase.create({
//   baseURL: HOSTNAME,
//   headers: {
//     Authorization: APIKEY,
//     Accept: 'application/vnd.api+json'
//   },
//   responseType: 'json'
// });

// // Players API から match id を取り出す
// async function getAPI(url) {
//   try {
//     let res = await axios.get(url);
//     return res;
//   } catch (error) {
//     console.error('getAPI ERROR!! =>' + error);
//   }
// }

// // match ID から 各試合の細かい情報をとってデータまとめる
// async function getMatches() {
//   let playerDataGetResult = await getAPI('/shards/steam/players?filter[playerNames]=UG_pubg');
//   // console.log(playerDataGetResult.data.data);
//   let playerMatchData = playerDataGetResult.data.data[0].relationships.matches.data;
//   // console.log(playerMatchData);
//   // 適当に40試合の matches URL 取得
//   let matchesReqestURL = [];
//   for (let x = 0; x < 40; x++) {
//     matchesReqestURL.push('/shards/steam/matches/' + playerMatchData[x].id);
//   }

//   // 40試合のうち、now or 最終試合から20時間未満の試合のみのリストにする
//   // =====================================================
//   let matcheList = [];
//   let todayDate = new Date();
//   // let lastMatcheDate;
//   for (let y = 0; y < matchesReqestURL.length; y++) {
//     let matcheDataGetResult = await getAPI(matchesReqestURL[y]);

//     let matcheDate = new Date(matcheDataGetResult.data.data.attributes.createdAt);
//     // if (y == 0) {
//     //   lastMatcheDate = new Date(matcheDataGetResult.data.data.attributes.createdAt);
//     // }

//     // 今日からか、最後の試合からか
//     // =====================================================
//     // var datesDiff = (lastMatcheDate - matcheDate) / 1000 / 60 / 60; // 直近試合との差分比較
//     var datesDiff = (todayDate - matcheDate) / 1000 / 60 / 60; // 直近試合との差分比較
//     // =====================================================

//     if (12 > datesDiff) { // 12時間以上マッチがあくまで追加
//       if (matcheDataGetResult.data.data.attributes.mapName != "Range_Main") { // トレモ除く
//         matcheList.push(matcheDataGetResult.data);
//       }
//     } else {
//       break; // 集まったら止める
//     }
//   }
//   // console.log(matcheList);
//   return matcheList;
// }

// // まとめたデータリストから平均ダメージと合計キル出す
// async function makeDatas() {

//   let matcheList = await getMatches();
//   // console.log(JSON.stringify(matcheList));
//   let matcheListLength = matcheList.length;
//   let totalDamage = 0;
//   let totalKills  = 0;

//   let detaNum = 0;
//   let stockDatas = [];

//   for (let y = 0; y < matcheListLength; y++) {
//     let matchsDetaDetail = matcheList[y].included;
//     // console.log(JSON.stringify(matchsDetaDetail));
//     for (let z = 0; z < matchsDetaDetail.length; z++) {
//       if(matchsDetaDetail[z].type == "participant") {
//         if(matchsDetaDetail[z].attributes.stats.name == "UG_pubg") {
//           let damageDealt = matchsDetaDetail[z].attributes.stats.damageDealt;
//           let kills = matchsDetaDetail[z].attributes.stats.kills;
//           detaNum++;
//           stockDatas.push([damageDealt]);
//           // stockDatas[detaNum] = kills;
//           // console.log("damageDealt => " + damageDealt);
//           // console.log("kills => " + kills);
//           // console.log('======================================================');
//           totalDamage = totalDamage + damageDealt;
//           totalKills = totalKills + kills;
//         }
//       }
//     }
//   }

//   console.log(stockDatas);
//   console.log('▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼');
//   console.log("平均ダメージ => " + totalDamage/matcheListLength);
//   console.log("合計KILL => " + totalKills);

//   let summarizeData = {
//     avgDamage: totalDamage/matcheListLength,
//     totalKills: totalKills
//   }
//   return summarizeData;
// }

// module.exports = async function() {
//     let result = await makeDatas();
//     return result;
// }
