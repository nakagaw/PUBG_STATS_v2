export class LocalStorageControls {
  // ストックした "_pubgStatsData__*" キーを集めてて新しい順にするやつ
  public summarizeStatsDataKeys = () => {
    let statsTableKeys: any = [];
    for (let i = 0; i < localStorage.length; i++) {
      if ( localStorage.key(i)!.match(/_pubgStatsData__/) ) {
        statsTableKeys.push(localStorage.key(i));
        statsTableKeys.sort( // 最新順に
          function(a: any,b: any){
            return (a < b ? 1 : -1);
          }
        );
      }
    }
    return statsTableKeys;
  }

  // ローカルストレージの全 "_pubgStatsData__*" データの配列作成
  public createAllStatsData = () => {
    const statsTableKeys =  this.summarizeStatsDataKeys();
    let statsTableData: any = {};
    for (let i = 0; i < statsTableKeys.length; i++) {
      let _statsTableData = JSON.parse(localStorage.getItem(statsTableKeys[i])!);
      statsTableData[statsTableKeys[i]] = _statsTableData;
    }
    return statsTableData;
  }
}