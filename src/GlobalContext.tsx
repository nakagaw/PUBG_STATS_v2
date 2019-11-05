import * as React from 'react';

const GlobalContext = React.createContext({});

export default GlobalContext;


// // import * as React from 'react';
// import { Container } from "unstated";

// interface IState {
//   userID?: string;
// }

// export default class GlobalStatesContainer extends Container<IState> {
//   state = {
//     userID: localStorage.getItem('_pubgUserID') ? localStorage.getItem('_pubgUserID')! : "UG_boy", // ID設定
//   };

//   // userID の入力フォーム
//   public setID = (newID: string) => {
//     this.setState({userID: newID});
//     console.log(newID);
//     console.log(this.state.userID)
//     setTimeout(() => {
//       console.log(this.state.userID)
//     }, 10)
//   }

//   // public filterGameModeChange = (value: string) => {
//   //   this.setState({filterGameMode: value});
//   // }

//   // public filterSeasonChange = (value: string) => {
//   //   this.setState({filterSeason: value});
//   // }
// }
