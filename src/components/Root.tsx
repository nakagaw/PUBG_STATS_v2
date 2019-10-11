import * as React from 'react';

import { PubgAPI } from '../api/PubgAPI';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// import GlobalStyle from './globalStyles';
// import Container from './atoms/Container/index';
// import Header from './atoms/Header/index';
// import Content from './atoms/Content/index';
// import Heading from './atoms/Heading/index';
// import Button from './atoms/Button/index';
// import TextInput from './atoms/TextInput/index';
// import StatsList from './molecules/StatsList/index';

import StatsDataTable from './StatsDataTable';

import {
  createMuiTheme,
  CssBaseline,
  AppBar,
  Container,
  Typography,
  FormControl,
  TextField,
  IconButton,
  Button,
  Switch,
  Paper,
  Grid,
} from '@material-ui/core';

import {
  CloudUpload,
  CloudDownload,
} from '@material-ui/icons';

import { ThemeProvider } from '@material-ui/styles';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

// ============================================
// firebase
// ============================================
const firebaseConfig = {
  apiKey: 'AIzaSyB-6fr79R883Xq7ycvFg1tPX5mGJZdrWd4',
  authDomain: 'my-pubg-stats.firebaseapp.com',
  databaseURL: 'https://my-pubg-stats.firebaseio.com',
  projectId: 'my-pubg-stats',
  storageBucket: 'my-pubg-stats.appspot.com',
  messagingSenderId: '2934131777',
  appId: '1:2934131777:web:c4aec14805014dc4'
};
firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.database();

// ============================================
// ============================================

interface State {
  hasError: boolean;
  value: string;
  userID: string;
  apiData: any;
  apiDataError: string;
  loading: boolean;
  success: boolean;
  checked: boolean;
  stockApiData: any;
}

export default class Root extends React.Component {
  public state: State = {
    hasError: false,
    value: "",
    userID: "",
    apiData: [],
    apiDataError: "No data",
    loading: true,
    success: true,
    checked: false,
    stockApiData: [],
  }

  // エラーハンドラー的な
  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ hasError: true });
    console.log('We did catch component error=>', error, errorInfo);
  }

  // 初期化的な
  componentWillMount() {
    // firebaseDB から ID取得
    // firebaseDB.ref('/').once('value')
    // .then( snapshot => {
    //   const dbData = snapshot.val();
    //   for (let userIDKey in dbData) {
    //     this.setState({ userID: userIDKey}) 
    //   }
    // })
    // .catch( error => {
    //   console.log(error);
    // });
    // ローカルストレージのデータから ID設定
    const _userIDKey = localStorage.getItem('_userID')!;
    if(_userIDKey !== null){
      this.setState({ userID: _userIDKey}) 
    }

    // ローカルストレージのデータから初期テーブル描画
    const _apiData = JSON.parse(localStorage.getItem('_pubgApiData')!);
    if(_apiData !== null){
      this.setState({ apiData: _apiData })
    }
    this.createStatsTable();
    
    // ローカルストレージからPlay中かどうかの判定
    const _playingState = localStorage.getItem('_playingState');
    if(_playingState === 'true'){
      this.setState({checked: true });
    } else {
      this.setState({checked: false });
    }
  }

  // firebaseDB からとってきたデータをローカルストレージに上書きでぶっこむ
  public getDBdatas = (event: any) => {
    firebaseDB.ref('/').once('value')
    .then( snapshot => {
      const dbData = snapshot.val();
      // userID をローカルストレージに保存
      const dbUserID = Object.keys(dbData);
      // console.log(dbUserID[0]);
      localStorage.setItem('_userID', dbUserID[0]);

      // スタッツデータ をローカルストレージに保存
      const dbStatsData: any = Object.values(dbData);
      let dbStatsDataKey: any = Object.keys(dbStatsData[0]);
      let dbStatsDataValue: any = Object.values(dbStatsData[0]);
      for (let i in dbStatsDataKey) {
        // console.log(dbStatsDataKey[i]);
        // console.log(dbStatsDataValue[i]);
        let dbStatsDataValueJSON = JSON.stringify(dbStatsDataValue[i],undefined,1);
        // console.log(dbStatsDataValueJSON);
        localStorage.setItem(dbStatsDataKey[i], dbStatsDataValueJSON);
      }    
      console.log('★ All localStorage data overwritten from firebaseDB!');
    })
    .catch( error => {
      console.log(error);
    });
  }

  // userID でテーブル作成して firebaseDB に書き込み
  public valueUpdate = (event: any) => {
    firebaseDB.ref(this.state.userID).set(this.state.stockApiData)
    .then( () => {
      console.log("FirebaseDB update ok! : " + this.state.userID);
    })
    .catch( error => {
      console.log(error);
    });
    event.preventDefault();
  }

  // userID の入力フォーム
  public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({userID: event.target.value});
  }

  // とりあえず40件のデータとって _pubgApiData に保存するやつ
  public getMatches = async (event?: any) => {
    if(event){
      console.log("Get start!");
      const pubgApi = new PubgAPI();
      pubgApi.getMatches(this.state.userID)
      .then( value => {
        this.setState({apiData: value});
        const pubgApiData = JSON.stringify(value,undefined,1);
        localStorage.setItem('_userID', this.state.userID);
        localStorage.setItem('_pubgApiData', pubgApiData);
      }, reason => {
        console.log("Error => " + reason);
      } );
    }
  }

  // Play開始時間移行の最新データがあるかチェックしてあったら _pubgApiData 更新するやつ
  public checkNewData = async (event?: any) => {
    const _playingStartTime = new Date(localStorage.getItem('_pubgPlayingStartTime')!);
    const pubgApi = new PubgAPI();
    pubgApi.getMatches(this.state.userID, _playingStartTime)
    .then( value => {
      this.setState({apiData: value});
      const pubgApiData = JSON.stringify(value,undefined,1);
      // console.log(pubgApiData);
      localStorage.setItem('_pubgApiData', pubgApiData);
    }, reason => {
      this.setState({apiDataError: "Should Play!"});
      console.log("Error => " + reason);
    } );
  }

  // Play中かどうかのやつ
  public playingState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const playingState = event.target.checked;
    localStorage.setItem('_playingState', playingState.toString());
    this.setState({checked: event.target.checked });
    // ローカルストレージからPlay中かどうかの判定
    const _playingState = localStorage.getItem('_playingState');
    if(_playingState === 'true'){ // Playing Now
      // 開始時間を記録
      const now = new Date();
      localStorage.setItem('_pubgPlayingStartTime', now.toString());
    } else { // Not Playing
      // Playing Now true中に溜まったデータを開始日キーにしてlocalStorageに _pubgStatsData__ として保存
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

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="sticky" style={{ padding: '6px 20px', marginBottom: '15x' }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item>
              <Typography variant="h6" component="h1" noWrap>
                Hello world
              </Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  id="pubgID"
                  label="ID"
                  value={this.state.userID}
                  onChange={this.changeUserID}
                  placeholder="Placeholder"
                  fullWidth
                  margin="dense"
                  variant="outlined"
                />
              </FormControl>
              <Button variant="contained" size="medium" style={{ marginLeft: '16px', marginTop: '10px' }} onClick={this.getMatches}>Get Recent 40 Stats!</Button>
              <Button variant="contained" size="medium" color={!this.state.checked ? 'default' : 'secondary'} style={{ marginLeft: '16px', marginTop: '10px' }} onClick={this.checkNewData}>Check updates!</Button>
            </Grid>
            <Grid item>
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>Not Playing</Grid>
                <Grid item>
                  <Switch
                    checked={this.state.checked}
                    onChange={this.playingState}
                    value="checked"
                    inputProps={{ 'aria-label': 'PLAYING NOW' }}
                  />
                </Grid>
                <Grid item>Playing Now</Grid>
              </Grid>
            </Grid>

            <Grid item style={{ flexGrow: 1}}></Grid>

            <Grid item>
              <IconButton aria-label="Get DB data" onClick={this.getDBdatas}>
                <CloudDownload />
              </IconButton>
              <IconButton aria-label="Save DB data" onClick={this.valueUpdate}>
                <CloudUpload />
              </IconButton>
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth={false}>
          <Grid container spacing={4}>
            <Grid item>
              <Paper>
                {this.state.apiData.length !== 0 ? (
                  <StatsDataTable tableData={this.state.apiData} />
                ) : (
                  <p style={{padding: '20px', marginTop: '30px'}}>{this.state.apiDataError}</p>
                )}
              </Paper>
            </Grid>
            <Grid item>
              <Grid container direction="row" alignItems="flex-start" style={{height: '100%', marginTop: '30px'}}>
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={this.state.checked}
                    onClick={this.createStatsTable}
                    aria-label="move all right"
                  >
                    ≫
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Paper>
                {/* <Grid container>
                    {this.state.stockApiData.map((value: any, i: number) => (
                    <Grid item key={i} style={{marginRight: '1px'}}>
                      <StatsDataTable tableData={value}/>
                    </Grid>
                    ))}
                </Grid> */}
                <Grid container>
                  {Object.keys(this.state.stockApiData).map((value: any, i: number) => (
                    <Grid item key={i} style={{marginRight: '1px'}}>
                      <StatsDataTable tableData={this.state.stockApiData[value]}/>
                    </Grid>
                  ))}
                </Grid>
    
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }
}
