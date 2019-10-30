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

  // フィルターのステート管理
  // public filterGameModeChange = (value: string) => {
  //   this.setState({filterGameMode: value});
  //   localStorage.setItem('_pubgGameMode', value);
  //   this.create(); //データ再描画
  // }

  // public filterSeasonChange = (value: string) => {
  //   this.setState({filterSeason: value});
  //   localStorage.setItem('_pubgFilterSeason', value);
  //   setTimeout(() => { // アニメーションのせい？か、これがないと setState できてない。promise 化したほうが良さそう
  //     this.create(); //データ再描画
  //   }, 10)
  // }
}



// // this.state.filterSeason

// interface IProps {
//   filterGameModeValue: (value: string) => void;
//   filterSeasonValue: (value: string) => void;
// }


// const useStatsTableState = ({
//   filterGameModeValue,
//   filterSeasonValue
// }: IProps) => {

//   const [filterGameMode, setFilterGameMode] = React.useState(filterGameModeValue);
//   const [filterSeason, setFilterSeason] = React.useState(filterSeasonValue);
  
//   React.useEffect(() => {
//     console.log("useEffect => " + filterGameMode);
//     console.log("useEffect => " + filterSeason);
//   }, []);

//   // const filterGameModeChangeHandler = () => {
//   //   const newValue = (event.target as HTMLInputElement).value;
//   //   filterGameModeValue(newValue);
//   //   // setFilterGameMode(newValue);
//   //   filterMenuClose();
//   // }

//   // const filterSeasonChangeHandler = () => {
//   //   const newValue = (event.target as HTMLInputElement).value;
//   //   filterSeasonValue(newValue);
//   //   // setFilterSeason(newValue);
//   //   filterMenuClose();
//   // }
  
//   const createStatsTable = ( ) => {
//     const statsTableKeys: any =  new LocalStorageControls().summarizeStatsDataKeys();
//     let statsTableData: any = {};

//     // シーズンフィルタ
//     for (let i = 0; i < statsTableKeys.length; i++) {
//       let _statsTableData = JSON.parse(localStorage.getItem(statsTableKeys[i])!);
//       const _filterSeason = season;
//       const seasonStart = new Date(seasonDate[_filterSeason][0]);
//       const seasonEnd = new Date(seasonDate[_filterSeason][1]);
//       const playedDate = new Date(_statsTableData.playedDate);
//       if ( seasonStart < playedDate && seasonEnd >= playedDate) {
//         // シーズン内に該当するデータだけを配列追加
//         statsTableData[statsTableKeys[i]] = _statsTableData;
//       }
//     }
//     if(statsTableData !== null){
//       this.setState({stockApiData: statsTableData});
//     }
//   }

//   return [timeLeft, reset];
//   };
// }