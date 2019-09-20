import * as React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import axios from 'axios';

// import GlobalStyle from './globalStyles';
// import Container from './atoms/Container/index';
// import Header from './atoms/Header/index';
// import Content from './atoms/Content/index';
// import Heading from './atoms/Heading/index';
// import Button from './atoms/Button/index';
// import TextInput from './atoms/TextInput/index';
// import StatsList from './molecules/StatsList/index';

import {
  CssBaseline,
  AppBar,
  Container,
  Typography,
  FormControl,
  TextField,
  Button
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
// axios
// ============================================
const APIKEY = process.env.REACT_APP_PUBG_API_KEY;
const HOSTNAME = 'https://api.pubg.com/';



// ============================================
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

  // Players API から match id を取り出す
  // ============================================
  public getAPI = async (url: string) => {
    try {
      const res = await axios.get(url, {
        baseURL: HOSTNAME,
        headers: {
          Authorization: APIKEY,
          Accept: 'application/vnd.api+json'
        },
        responseType: 'json'
      });
      return res;
    } catch (error) {
      console.error('getAPI ERROR!! =>' + error);
    }
    return null;
  }

  // match ID から 各試合の細かい情報をとってデータまとめる
  // ============================================
  public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({userID: event.target.value});
  }

  public getMatches = async (event?: any) => {
    if(event){
      let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + this.state.userID);
      console.log("きてる 2 " + JSON.stringify(playerDataGetResult));
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
              label="PUBG ID"
              value={this.state.userID}
              onChange={this.changeUserID}

              placeholder="Placeholder"
              helperText="PleaseInput your PUBG ID"
              fullWidth
              margin="dense"
              variant="outlined"
            />
          </FormControl>
          <Button variant="contained" color="primary"　size="large" style={{ marginLeft: '16px', marginTop: '6px' }} onClick={this.getMatches}>Get PUBG API!!</Button>
        </Container>
      </div>
    );
  }
}
