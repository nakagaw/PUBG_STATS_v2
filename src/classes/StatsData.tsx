import { LocalStorageControls } from './LocalStorageControls';

export class StatsData {

  // ストックした "_pubgStatsData__*" データからテーブルデータ作るやつ
  public create = (season: string) => {
    const statsTableKeys: any =  new LocalStorageControls().summarizeStatsDataKeys();
    let statsTableData: any = {};

    // シーズンフィルタ
    const seasonDate: any = {
      "current-season" : ["2019/10/22","2020/01/30"],
      "season-4" : ["2019/07/24","2019/10/22"]
    }
    for (let i = 0; i < statsTableKeys.length; i++) {
      let _statsTableData = JSON.parse(localStorage.getItem(statsTableKeys[i])!);
      const _filterSeason = season;
      const seasonStart = new Date(seasonDate[_filterSeason][0]);
      const seasonEnd = new Date(seasonDate[_filterSeason][1]);
      const playedDate = new Date(_statsTableData.playedDate);
      if ( seasonStart < playedDate && seasonEnd >= playedDate) {
        // シーズン内に該当するデータだけを配列追加
        statsTableData[statsTableKeys[i]] = _statsTableData;
      }
    }
    if(statsTableData !== null){
      return statsTableData;
    }
  }
}