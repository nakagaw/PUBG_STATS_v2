import * as React from 'react';

// API Classes
import { PubgAPI } from './api/PubgAPI';

// Components
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import StatsDataTable from './components/StatsDataTable';

// Material UI
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  FormControl,
  FormControlLabel,
  TextField,
  IconButton,
  Button,
  Switch,
  Paper,
  Grid,
  Menu,
  // MenuItem,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import {
  CloudUpload,
  CloudDownload,
  FilterList,
} from '@material-ui/icons';

// firebase
import { firebaseDB } from './firebaseConfig'

// ============================================
// ============================================

interface IState {
  hasError: boolean;
  value: string;
  userID: string;
  apiData: any;
  apiDataError: string;
  loading: boolean;
  playingState: boolean;
  playingDate: string;
  stockApiData: any;
  filterMenuState: any;
  filterKey?: any;
}

export default class App extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      hasError: false,
      value: "",
      userID: localStorage.getItem('_userID')!, // ID設定
      apiData: JSON.parse(localStorage.getItem('_pubgApiData')!) ? JSON.parse(localStorage.getItem('_pubgApiData')!) : [], // 初期テーブル描画
      apiDataError: "No data",
      loading: false,
      playingState: localStorage.getItem('_playingState') === "true" ? true : false, //Play中かどうかの判定
      playingDate: localStorage.getItem('_playingState') === "true" ? this.changefilterDateFormat(localStorage.getItem('_pubgPlayingStartTime')!) : "",
      stockApiData: [],
      filterMenuState: null,
      filterKey: "all",
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

  // firebaseDB からとってきたデータをローカルストレージに上書きでぶっこむ
  public getDBdatas = (event: any) => {
    this.setState({loading: true});
    const _userIDKey = localStorage.getItem('_userID')!;
    firebaseDB.ref('/users/').once('value')
    .then( snapshot => {
      console.log("Get data from FirebaseDB! : " + this.state.userID);
      const dbData = snapshot.val();
      // userID をローカルストレージに保存
      if(dbData[_userIDKey] !== undefined ) {
        // スタッツデータ をローカルストレージに保存
        let dbStatsDataKey: any = Object.keys(dbData[_userIDKey]);
        let dbStatsDataValue: any = Object.values(dbData[_userIDKey]);
        for (let i in dbStatsDataKey) {
          // console.log(dbStatsDataKey[i]);
          // console.log(dbStatsDataValue[i]);
          let dbStatsDataValueJSON = JSON.stringify(dbStatsDataValue[i],undefined,1);
          // console.log(dbStatsDataValueJSON);
          localStorage.setItem(dbStatsDataKey[i], dbStatsDataValueJSON);
        }
        console.log('★ All localStorage data overwritten from firebaseDB!');
      } else {
        console.log('▲ Error => Not found user on firebaseDB...');
      }
      this.setState({loading: false});
    })
    .catch( error => {
      console.log(error);
      this.setState({loading: false});
    });
  }

  // userID でテーブル作成して firebaseDB に書き込み
  public valueUpdate = (event: any) => {
    this.setState({loading: true});
    firebaseDB.ref('users/' + this.state.userID).set(this.state.stockApiData)
    .then( () => {
      console.log("FirebaseDB update ok! : " + this.state.userID);
      this.setState({loading: false});
    })
    .catch( error => {
      console.log(error);
      this.setState({loading: false});
    });
    event.preventDefault();
  }

  // userID の入力フォーム
  public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({userID: event.target.value});
  }

  // filtereDate の入力フォーム
  public changefiltereDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({playingDate: event.target.value});
    // localStorage.setItem('_pubgPlayingStartTime', new Date(event.target.value).toString());
  }

  // input type=date 用に "yyyy-MM-ddThh:mm" フォーマット
  public changefilterDateFormat = (date: string) => {
    const formatDate = new Date(date).toLocaleString().replace(/\//g,'-').split(/\./)[0];
    const formatDate1 = formatDate.split(/\s/)[0];
    let formatDate2 = formatDate.split(/\s/)[1];
    const zeroFormat = formatDate2.split(":");
    zeroFormat[0] = ("0"+zeroFormat[0]).slice(-2); // 月の0埋め
    zeroFormat[1] = ("0"+zeroFormat[1]).slice(-2); // 日の0埋め
    formatDate2 = zeroFormat[0] + ":" + zeroFormat[1] + ":" + zeroFormat[2];
    return formatDate1 + "T" + formatDate2;
  }

  // とりあえず40件のデータとって _pubgApiData に保存するやつ
  public getMatches = async (id: string, date?: Date) => {
    this.setState({loading: true});
    const pubgApi = new PubgAPI();
    pubgApi.getMatches(id, date)
    .then( value => {
      this.setState({apiData: value});
      const pubgApiData = JSON.stringify(value,undefined,1);
      // console.log(pubgApiData);
      localStorage.setItem('_pubgApiData', pubgApiData);
      this.setState({loading: false});
    }, reason => {
      this.setState({apiDataError: "Should Play!"});
      console.log("Error => " + reason);
      this.setState({loading: false});
    } );
  }

  // Play開始時間移行の最新データがあるかチェックしてあったら _pubgApiData 更新するやつ
  public checkUpdates = async (event?: any) => {
    localStorage.setItem('_userID', this.state.userID);
    // input 入力チェック
    if(this.state.playingDate !== ""){
       // input 入力値が強い・なかったらローカルストレージ
      localStorage.setItem('_pubgPlayingStartTime', new Date(this.state.playingDate).toString());
      const _playingStartTime = new Date(localStorage.getItem('_pubgPlayingStartTime')!);
      this.getMatches(this.state.userID, _playingStartTime);
    } else { // input 未入力
      this.getMatches(this.state.userID);
    };
  }

  // 既存ローカルデータと比較してバックアップ保存するか上書き保存するか
  public diffLocalDataCheckSave = () => {
    const _todayStatsData = localStorage.getItem('_pubgApiData')!;
    const _playedTime = new Date(localStorage.getItem('_pubgPlayingStartTime')!).toISOString().split(/T/)[0];
    const _todayStatsDataCheck = localStorage.getItem("_pubgStatsData__" + _playedTime)!;
    const hash = Math.random().toString(32).substring(2);
    if(_todayStatsData !== _todayStatsDataCheck) { //空以外の既存データと違うデータがあったら保存
      if(_todayStatsData !== "[]") {
        localStorage.setItem("_pubgStatsData__" + _playedTime, _todayStatsData);
        console.log('◎ Saved to Local strage with Key: ' + _playedTime);
      }
    } else { // 同じでも、データがあったら念の為ハッシュ付きで
      if(_todayStatsData !== null) {
        localStorage.setItem(_playedTime + "__bak__" + hash, _todayStatsData);
        console.log('△ Already saved to Local strage, so + hash to Key: ' + _playedTime + "-" + hash);
      }
    }
  }

  // Play中かどうかのやつ
  public playingStateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const playingStateChecked = event.target.checked;
    localStorage.setItem('_playingState', playingStateChecked.toString());
    this.setState({playingState: event.target.checked });
    // ローカルストレージからPlay中かどうかの判定
    const _playingState = localStorage.getItem('_playingState');
    if(_playingState === 'true'){ // Playing Now
      // 開始時間を記録
      const now = new Date();
      localStorage.setItem('_pubgPlayingStartTime', now.toString()); // こっちは差分チェックで使うのこのフォーマット必須
      this.setState({playingDate: this.changefilterDateFormat(now.toString()) }); // input用
      // データクリア
      localStorage.removeItem('_pubgApiData'); 
      this.setState({ apiData: [] })
    } else { // Not Playing
      this.diffLocalDataCheckSave();
    }
  }
  
  // ストックした "_pubgStatsData__*" データからテーブルデータ作るやつ
  public createStatsTable = (event?: any) => {
    let statsTableKeyData: any = [];
    let statsTableData: any = {};
    for (let i = 0; i < localStorage.length; i++) {
      if ( localStorage.key(i)!.match(/_pubgStatsData__/) ) {
        statsTableKeyData.push(localStorage.key(i));
        statsTableKeyData.sort( // 最新順に
          function(a: any,b: any){
            return (a < b ? 1 : -1);
          }
        );
      }
    }
    for (let i = 0; i < statsTableKeyData.length; i++) {
        statsTableData[statsTableKeyData[i]] = JSON.parse(localStorage.getItem(statsTableKeyData[i])!);
    }
    if(statsTableData !== null){
      this.setState({stockApiData: statsTableData});
    }
    // console.log(statsTableKeyData);
    // console.log(statsTableData);

    // Now PlayingストックデータDOMは消して空データで再描画
    localStorage.removeItem('_pubgApiData'); 
    this.setState({ apiData: [] })
  }

  // とってきた過去データを保存 左から右へ
  public refreshData = (event?: any) => {
    this.diffLocalDataCheckSave(); //描画中の過去データ保存してからの↓
    this.createStatsTable(); //データ再描画
  }

  // フィルターボタン
  public filterMenuClick = (event: React.MouseEvent<HTMLDataElement>) => {
    this.setState({filterMenuState: event.currentTarget});
  }
  public filterMenuClose = (event?: any) => {
    this.setState({filterMenuState: null});
  }
  public filterKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log((event.target as HTMLInputElement).value);
    this.setState({filterKey: (event.target as HTMLInputElement).value});
    this.createStatsTable(); //データ再描画
    this.filterMenuClose();
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return (
      <React.Fragment>
        <Loading state={this.state.loading} />
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px' }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Toolbar>
              <Navbar />
              <Typography variant="h6" component="h1" noWrap>
                TODAY's STATS
              </Typography>
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
              <FormControl style={{ marginLeft: '7px', marginRight: '13px', width: '250px' }}>
                <TextField
                  type="datetime-local"
                  id="filterDate"
                  label="Filter date"
                  value={this.state.playingDate}
                  onChange={this.changefiltereDate}
                  disabled={this.state.playingState}
                  placeholder="Placeholder"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
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
              {this.state.loading && <div style={{ textAlign: 'right', fontSize: '12px'}}>ლ(╹◡╹ლ)</div>}
            </Grid>
            <Grid item>
              <IconButton aria-label="Get DB data" onClick={this.getDBdatas}>
                <CloudDownload />
              </IconButton>
              <IconButton aria-label="Save DB data" onClick={this.valueUpdate}>
                <CloudUpload />
              </IconButton>
              <IconButton aria-controls="Filter datas" aria-haspopup="true" onClick={this.filterMenuClick}>
                <FilterList />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={this.state.filterMenuState}
                keepMounted
                open={Boolean(this.state.filterMenuState)}
                onClose={this.filterMenuClose}
              >
                <RadioGroup aria-label="gender" name="filter" value={this.state.filterKey} onChange={this.filterKeyChange} 
                style={{padding: "10px 15px"}}>
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="solo-fpp"
                    control={<Radio />}
                    label="Solo FPP"
                  />
                  <FormControlLabel
                    value="squad-fpp"
                    control={<Radio />}
                    label="Squad FPP"
                  />
                </RadioGroup>
              </Menu>
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth={false}>
          <Grid container spacing={4} wrap="nowrap">
            <Grid item style={{ padding: '0'}}>
              <Paper>
                {this.state.apiData.length !== 0 ? (
                  <StatsDataTable tableData={this.state.apiData} />
                ) : (
                  <p style={{padding: '10px', minWidth: "127px", textAlign: "center"}}>{this.state.apiDataError}</p>
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
            <Grid item style={{overflowY: 'auto', padding: '0'}}>
              <Grid container wrap="nowrap">
                {Object.keys(this.state.stockApiData).map((value: any, i: number) => (
                  <Grid item key={i} style={{marginRight: '1px'}}>
                    <StatsDataTable tableData={this.state.stockApiData[value]} filterKey={this.state.filterKey} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}