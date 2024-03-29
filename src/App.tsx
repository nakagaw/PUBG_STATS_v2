import * as React from 'react';

// Classes
import { PubgAPI } from './classes/PubgAPI';
import { StatsData } from './classes/StatsData';
import { FightLog } from './classes/FightLog';

// Components
import Loading from './components/Loading';
import FilterMenu from './components/FilterMenu';
import Navbar from './components/Navbar';
import StatsDataTable from './components/StatsDataTable';

// Material UI
import {
  AppBar,
  Toolbar,
  Container,
  // Typography,
  FormControl,
  TextField,
  IconButton,
  Button,
  Switch,
  Checkbox,
  Tooltip,
  Paper,
  Grid,
} from '@material-ui/core';

import {
  SportsKabaddi
} from '@material-ui/icons';


// ============================================
// ============================================

interface IState {
  hasError: boolean;
  value: string;
  userID: string;
  apiStatsData: any;
  apiTelemetryDataURLs: any;
  fightLog: any;
  apiGetError: string;
  getApiDataLoading: boolean;
  playingState: boolean;
  playingDate: string;
  urumuchiState: boolean;
  stockApiData: any;
  filterMenuState: any;
  filterGameMode?: any;
  filterSeason?: any;
  createTableLoading: boolean;
}

export default class App extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      hasError: false,
      value: "",
      userID: localStorage.getItem('_pubgUserID') ? localStorage.getItem('_pubgUserID')! : "UG_boy", // ID設定
      apiStatsData: JSON.parse(localStorage.getItem('_pubgApiStatsData')!) ? JSON.parse(localStorage.getItem('_pubgApiStatsData')!) : [], // 初期テーブル描画
      apiTelemetryDataURLs: JSON.parse(localStorage.getItem('_pubgApiTelemetryDataURLs')!) ? JSON.parse(localStorage.getItem('_pubgApiTelemetryDataURLs')!) : [],
      fightLog: JSON.parse(localStorage.getItem('_pubgFightLog')!) ? JSON.parse(localStorage.getItem('_pubgFightLog')!) : [],
      apiGetError: "No data",
      getApiDataLoading: false,
      playingState: localStorage.getItem('__pubgPlayingState') === "true" ? true : false, //Play中かどうかの判定
      playingDate: localStorage.getItem('__pubgPlayingState') === "true" ? this.changefilterDateFormat(localStorage.getItem('_pubgPlayingStartTime')!) : "",
      urumuchiState: localStorage.getItem('_urumuchiState') === "true" ? true : false,
      stockApiData: [],
      filterMenuState: null,
      filterGameMode: localStorage.getItem('_pubgGameMode') ? localStorage.getItem('_pubgGameMode')! : "all",
      filterSeason: localStorage.getItem('_pubgFilterSeason') ? localStorage.getItem('_pubgFilterSeason')! : "current-season",
      createTableLoading: false,
    }
  }

  // エラーハンドラー的な
  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ hasError: true });
    console.log('We did catch component error=>', error, errorInfo);
  }

  // テーブル初期化的な
  componentDidMount() {
    this.createStatsTable();
  }

  // userID の入力フォーム
  public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({userID: (event.target as HTMLInputElement).value});
  }

  // filterDate の入力フォーム
  public changefilterDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({playingDate: (event.target as HTMLInputElement).value});
  }

  // input type=date 用に "yyyy-MM-ddThh:mm" フォーマット
  public changefilterDateFormat = (date: string) => {
    var d = new Date(date);
    const _urumuchiState = localStorage.getItem('_urumuchiState');
    if(_urumuchiState === 'true'){ // ウルムチ設定のときは -1h
      const shift = d.getTime()+8*60*60*1000;
      const time = new Date(shift).toISOString().split('.')[0];
      return time;
    } else {
      const shift = d.getTime()+9*60*60*1000;
      const time = new Date(shift).toISOString().split('.')[0];
      return time;
    }
  }

  // とりあえず50件のデータとって _pubgApiStatsData に保存するやつ
  public getMatches = async (userID: string, playingStartTime?: Date) => {
    this.setState({getApiDataLoading: true});
    const pubgApi = new PubgAPI();
    pubgApi.getMatches(userID, playingStartTime, this.state.urumuchiState)
    .then((value: any) => {
      // console.log(value[0]);
      // console.log(value[1]);
      this.setState({apiStatsData: value[0]});
      this.setState({apiTelemetryDataURLs: value[1]});
      const pubgApiStatsData = JSON.stringify(value[0],undefined,1);
      const pubgApiTelemetryDataURLs = JSON.stringify(value[1]);
      localStorage.setItem('_pubgApiStatsData', pubgApiStatsData);
      localStorage.setItem('_pubgApiTelemetryDataURLs', pubgApiTelemetryDataURLs);
      this.setState({getApiDataLoading: false});
    }, (reason: any) => {
      this.setState({apiGetError: "Should Play!"});
      console.log("Error => " + reason);
      this.setState({getApiDataLoading: false});
    } );
  }

  // Play開始時間移行の最新データがあるかチェックしてあったら _pubgApiStatsData 更新するやつ
  public checkUpdates = async (event?: any) => {
    localStorage.setItem('_pubgUserID', this.state.userID);
    // input 入力チェックしてはいってたら
    if(this.state.playingDate !== ""){
      localStorage.setItem('_pubgPlayingStartTime', this.state.playingDate); // input => ローカルストレージ
      const _playingStartTime = new Date(localStorage.getItem('_pubgPlayingStartTime')!); // ローカルストレージ => getMatches
      this.getMatches(this.state.userID, _playingStartTime);
    } else { // input 未入力
      this.getMatches(this.state.userID);
    };
  }

  // 既存ローカルデータと比較してバックアップ保存するか上書き保存するか
  public diffLocalDataCheckSave = () => {
    const _todayStatsData = localStorage.getItem('_pubgApiStatsData')!;
    // JSON.parse(_todayStatsData).playedDate じゃなくて、_pubgPlayingStartTime なのは、データ作った日をキーにする意味で => なんか微妙に不整合起こるのでやめ
    // const _timeStamp = new Date(localStorage.getItem('_pubgPlayingStartTime')!).toISOString().split(/T/)[0];
    if(_todayStatsData) {
      const shift = JSON.parse(_todayStatsData).playedDate.split("/");
      const _timeStamp = shift[0] + "-" + shift[1] + "-" + shift[2];
      const _todayStatsDataCheck = localStorage.getItem("_pubgStatsData__" + _timeStamp)!;
      const hash = Math.random().toString(32).substring(2);
      if(_todayStatsData !== _todayStatsDataCheck) { //空以外の既存データと違うデータがあったら保存
        if(_todayStatsData !== "[]") {
          localStorage.setItem("_pubgStatsData__" + _timeStamp, _todayStatsData);
          console.log('◎ Saved to Local strage with Key: ' + _timeStamp);
        }
      } else { // 同じでも、データがあったら念の為ハッシュ付きで
        localStorage.setItem(_timeStamp + "__bak__" + hash, _todayStatsData);
        console.log('△ Already saved to Local strage, so + hash to Key: ' + _timeStamp + "-" + hash);
      }
    };
  }

  // Play中かどうかのやつ
  public playingStateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const playingStateChecked = event.target.checked;
    localStorage.setItem('__pubgPlayingState', playingStateChecked.toString());
    this.setState({playingState: event.target.checked });
    // ローカルストレージからPlay中かどうかの判定
    const __pubgPlayingState = localStorage.getItem('__pubgPlayingState');
    if(__pubgPlayingState === 'true'){ // Playing Now
      // 開始時間を記録
      const now = new Date();
      localStorage.setItem('_pubgPlayingStartTime', this.changefilterDateFormat(now.toString()));
      this.setState({playingDate: this.changefilterDateFormat(now.toString()) }); // input用
      this.clearPlayingData();// データクリア
    } else { // Not Playing
      this.diffLocalDataCheckSave();
    }
  }

  // Play中のデータとローカルストレージ消す
  public clearPlayingData = () => {
    localStorage.removeItem('_pubgApiStatsData');
    this.setState({ apiStatsData: [] })
  }

  // とってきた過去データを保存 左から右へ
  public refreshData = (event?: any) => {
    this.diffLocalDataCheckSave(); //描画中の過去データ保存してからの↓
    this.createStatsTable(); //データ再描画
    this.clearPlayingData();
  }

  // ストックした "_pubgStatsData__*" データから画面表示用のデータ作るやつ
  public createStatsTable = (event?: any) => {
    this.setState({createTableLoading: true});
    const statsTableData = new StatsData();
    statsTableData.create(this.state.filterSeason)
    .then((value: any) => {
      this.setState({stockApiData: value});
      this.setState({createTableLoading: false});
    }, (reason: any) => {
      console.log("statsTableData ないよー => " +  reason);
      this.setState({getApiDataLoading: false});
    });
  }

  // フィルターのステート管理
  public filterGameModeChange = (value: string) => {
    this.setState({filterGameMode: value});
    localStorage.setItem('_pubgGameMode', value);
    this.createStatsTable(); //データ再描画
  }
  public filterSeasonChange = (value: string) => {
    this.setState({filterSeason: value});
    localStorage.setItem('_pubgFilterSeason', value);
    setTimeout(() => { // アニメーションのせい？か、これがないと setState できてない。promise 化したほうが良さそう
      this.createStatsTable(); //データ再描画
    }, 10)
  }

  // ウルムチ設定かどうかのやつ
  public urumuchiStateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const urumuchiStateChecked = event.target.checked;
    localStorage.setItem('_urumuchiState', urumuchiStateChecked.toString());
    this.setState({urumuchiState: event.target.checked });
  }

  // getEnemiesData
  public getEnemiesData = () => {
    this.setState({getApiDataLoading: true});
    const urls = JSON.parse(localStorage.getItem('_pubgApiTelemetryDataURLs')!);
    const fightLog = new FightLog();
    fightLog.getTelemetryData(urls)
    .then((value: any) => {
      // console.log(value);
      const _todayStatsData = JSON.parse(localStorage.getItem('_pubgApiStatsData')!);
      let statsDataListWithFightLog: any = {};
      // _todayStatsData の telemetryURL と FightLog の url で照合して合致したら
      const pubgFightLog = _todayStatsData.data.map((item: any, index: number ) => {
        // console.log(Object.keys(value)[index]);
        // console.log(item.telemetryURL);
        let url = Object.keys(value)[index];
        if(item.telemetryURL === url) {
          // console.log(value);
          item["fightLog"] = value[url];
        }
        return item;
      });
      // _pubgApiStatsData と同じデータ構造にしてひとまず _pubんgFightLog として保存
      statsDataListWithFightLog.data = pubgFightLog; 
      statsDataListWithFightLog.playedDate = _todayStatsData.playedDate;
      localStorage.setItem('_pubgFightLog', JSON.stringify(statsDataListWithFightLog,undefined,1));
      if(_todayStatsData.data.length === statsDataListWithFightLog.data.length) { // 同じ配列数か存在チェックして同じだったら上書き
        console.log('◎ Saved to _pubgApiStatsData after adding FightLog');
        localStorage.setItem('_pubgApiStatsData', JSON.stringify(statsDataListWithFightLog,undefined,1));
        this.createStatsTable(); //データ再描画
      } else {
        console.log('△ Different data : _pubgApiStatsData and _pubgFightLog');
      }
      this.createStatsTable(); //データ再描画
      this.setState({getApiDataLoading: false});
    }, (reason: any) => {
      console.log("Puppeteer はいけてるっぽいけど TelemetryData ないよー => " +  reason);
      this.setState({getApiDataLoading: false});
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return (
      <React.Fragment>
        <Loading state={this.state.getApiDataLoading} type="linear" />
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px', backgroundColor: "rgb(64, 64, 64)" }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Toolbar style={{ paddingRight: 0 }}>
              <Navbar userID={this.state.userID} tableUpdate={this.createStatsTable} />
            </Toolbar>
            <Grid item>
              <FormControl style={{ width: '130px' }}>
                <TextField
                  id="pubgID"
                  label="ID"
                  value={this.state.userID}
                  onChange={this.changeUserID}
                  disabled={this.state.playingState}
                  placeholder="Placeholder"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
              <FormControl style={{ marginLeft: '7px', width: '305px', flexDirection: 'row', alignItems: 'center' }}>
                <TextField
                  type="datetime-local"
                  id="filterDate"
                  label="Filter date"
                  value={this.state.playingDate}
                  onChange={this.changefilterDate}
                  disabled={this.state.playingState}
                  placeholder="Placeholder"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ width: '265px' }}
                />
                <Tooltip title="ウルムチ設定">
                  <Checkbox
                    checked={this.state.urumuchiState}
                    onChange={this.urumuchiStateCheck}
                    disabled={this.state.playingState}
                    value="checked"
                    color="default"
                    style={{ flexBasis: '40px' , height: '40px', marginTop: '2px' }}

                  />
                </Tooltip>
              </FormControl>
              <Button variant="contained" size="medium" color={!this.state.playingState ? 'default' : 'secondary'} style={{ marginTop: '10px' }} onClick={this.checkUpdates}>Check updates!</Button>
            </Grid>
            <Grid item>
              <Grid component="label" container alignItems="center" wrap="nowrap" spacing={1}>
                <Grid item>Not Playing</Grid>
                <Grid item>
                  <Switch
                    checked={this.state.playingState}
                    onChange={this.playingStateCheck}
                    value="checked"
                    inputProps={{ 'aria-label': 'PLAYING NOW' }}
                  />
                </Grid>
                <Grid item>Playing Now!</Grid>
              </Grid>
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
            </Grid>
            <Grid item>
              <Tooltip title="Get telemenly data(beta)">
                <IconButton aria-controls="Get Enemies Data" onClick={this.getEnemiesData} disabled={this.state.apiStatsData.length === 0}>
                  <SportsKabaddi color={this.state.apiStatsData.length === 0 ? 'disabled' : 'secondary'} />
                </IconButton>
              </Tooltip>
              <FilterMenu
                initGameModeValue={this.state.filterGameMode}
                initSeasonValue={this.state.filterSeason}
                filterGameModeValue={this.filterGameModeChange}
                filterSeasonValue={this.filterSeasonChange}
              />
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth={false}>
          <Grid container spacing={4} wrap="nowrap">
            <Grid item style={{ padding: '0'}}>
              <Paper style={{ backgroundColor: "#292929"}}>
                {this.state.apiStatsData.length !== 0 ? (
                  <StatsDataTable tableData={this.state.apiStatsData} filterGameMode={this.state.filterGameMode} />
                ) : (
                  <p style={{padding: '10px', minWidth: "127px", textAlign: "center"}}>{this.state.apiGetError}</p>
                )}
              </Paper>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="flex-start" style={{height: '100%', marginTop: '20px'}}>
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={this.state.playingState}
                    onClick={this.refreshData}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{overflowY: 'auto', padding: 0, flexGrow: 1}}>
              <Grid container wrap="nowrap">
                {Object.keys(this.state.stockApiData).map((value: any, i: number) => { 
                  return (
                    <Grid item key={i} style={{marginRight: '1px', position: 'relative'}}>
                      <StatsDataTable tableData={this.state.stockApiData[value]} filterGameMode={this.state.filterGameMode} />
                    </Grid>
                  )
                })}
              </Grid>
              <Loading state={this.state.createTableLoading} type="circular" />
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}