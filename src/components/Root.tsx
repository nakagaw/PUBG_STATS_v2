import * as React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import axiosBase from 'axios';

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
  CssBaseline,
  AppBar,
  Container,
  Typography,
  FormControl,
  TextField,
  Button,
  Paper,
} from '@material-ui/core';



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

const db = firebase.database();
const root = db.ref("/");

// ============================================
// axios インスタンスを生成する
// ============================================
const APIKEY = process.env.REACT_APP_PUBG_API_KEY;
const HOSTNAME = 'https://api.pubg.com';
const axios = axiosBase.create({
  baseURL: HOSTNAME,
  headers: {
    Authorization: APIKEY,
    Accept: 'application/json'
    // Accept: 'application/vnd.api+json' // <= 公式docはこれだけどなぜかこれだととれない。。
  }
});


// ============================================
// ============================================

interface State {
  value: string;
  userID: string;
}

export default class Root extends React.Component {
  public state: State = {
    value: "",
    userID: ""
  }

  // 初期化的な
  componentDidMount() {
    root.on("value", snapshot => this.setState({ value: snapshot.val().value}))
    this.setState({ userID: "UG_boy"})
  }

  public changeValue= (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({value: event.target.value});
  }

  public valueUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    root.set({
      value: this.state.value
    })
    .then(() => {
      console.log("update ok");
    })
    .catch((error) => {
      console.log(error);
    });
    event.preventDefault();
  }

  public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({userID: event.target.value});
  }



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
  public getMatches = async (event?: any) => {
    if(event){
      let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + this.state.userID);
      // console.log(playerDataGetResult);
      let playerMatchData = playerDataGetResult!.data.data[0].relationships.matches.data;

      // 適当に40試合の matches URL 取得してリスト化
      // =====================================================
      let matchesReqestURL = [];
      for (let x = 0; x < 40; x++) {
        matchesReqestURL.push('/shards/steam/matches/' + playerMatchData[x].id);
      }
      // console.log(matchesReqestURL);


      // 40試合のうち、トレモ除いた試合のJSONデータにする
      // =====================================================
      let matcheList: any = [];
      for (let y = 0; y < matchesReqestURL.length; y++) {
        let matcheDataGetResult = await this.getAPI(matchesReqestURL[y]);
        if(matcheDataGetResult !== null){
          if (matcheDataGetResult.data.data.attributes.mapName !== "Range_Main") { // トレモ除く
             matcheList.push(matcheDataGetResult.data);
          }
        }
      }
      console.log(matcheList);



      // 各種データまとめる
      // =====================================================

      // マッチデータ
      for (let y = 0; y < matcheList.length; y++) {
        let createdAt   = new Date(matcheList[y].data.attributes.createdAt);
        let matcheDate  = createdAt.toLocaleString(); // JSTに変換
        let gameMode    = matcheList[y].data.attributes.gameMode;
        let mapName     = matcheList[y].data.attributes.mapName;
        let rosters     = matcheList[y].data.relationships.rosters.data.length;
        console.log(matcheDate + " / " + gameMode + " / " + mapName);

        let matchsDetaDetail = matcheList[y].included;
         // 個人データ
        for (let z = 0; z < matchsDetaDetail.length; z++) {
          if(matchsDetaDetail[z].type === "participant") {
            if(matchsDetaDetail[z].attributes.stats.name === this.state.userID) {
              let winPlace    = matchsDetaDetail[z].attributes.stats.winPlace;
              let damageDealt = Math.round(matchsDetaDetail[z].attributes.stats.damageDealt * 10) / 10;
              let kills       = matchsDetaDetail[z].attributes.stats.kills;
              console.log(kills + " Kills (" + damageDealt + " Damages)"  + " / RANK: #" + winPlace + "/" + rosters);
            }
          }
        }
      }
    }
  }


  render() {
    return (
      <div>
        <CssBaseline />
        <AppBar position="sticky" style={{ padding: '10px 30px', marginBottom: '30px' }}>
          <Typography variant="h6" component="h1" noWrap>
            Hello world
          </Typography>
        </AppBar>
        <Container>
          <FormControl>
            <TextField
              id="pubgID"
              label="ID"
              value={this.state.userID}
              onChange={this.changeUserID}
              placeholder="Placeholder"
              helperText="PleaseInput your PUBG ID"
              fullWidth
              margin="dense"
              variant="outlined"
            />
          </FormControl>
          <Button variant="contained" color="primary"　size="large" style={{ marginLeft: '16px', marginTop: '6px' }} onClick={this.getMatches}>Get API!!</Button>

          <Paper style={{ marginTop: '30px' }}>
            <StatsDataTable />
          </Paper>
        </Container>
      </div>
    );
  }
}
