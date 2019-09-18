import * as React from 'react';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import axios from 'axios';

// ============================================
// components
// ============================================
import GlobalStyle from './globalStyles';
import Container from './atoms/Container/index';
import Header from './atoms/Header/index';
import Content from './atoms/Content/index';
import Heading from './atoms/Heading/index';
import Button from './atoms/Button/index';
import TextInput from './atoms/TextInput/index';

import StatsList from './molecules/StatsList/index';

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

  public getMatches = async (event?: React.MouseEvent<HTMLInputElement>) => {
    if(event){
      let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + this.state.userID);
      console.log("きてる 2 " + JSON.stringify(playerDataGetResult));
    }
  }

  render() {
    return (
      <Container>
        <GlobalStyle />
        <Header><Heading>Hello world</Heading></Header>
        <Content>
          <StatsList  />
          <TextInput type="text" id="pubgID" size="sm" className="mg-r-10" value={this.state.userID}  onChange={this.changeUserID} />
          <Button type="button" className="mg-b-30" color="secondary" size="sm" onClick={this.getMatches}>Get PUBG API!!</Button>

          <form onSubmit={this.valueUpdate}>
            <TextInput type="text" id="valueInput" size="sm" className="mg-r-10" value={this.state.value} onChange={this.changeValue} />
            <Button type="submit" id="updateButton" color="primary" size="sm">Update Firebase DB</Button>
          </form>
        </Content>
      </Container>
    );
  }
}
