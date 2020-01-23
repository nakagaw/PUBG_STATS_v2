import * as React from 'react';

// Classes
import { StatsData } from './classes/StatsData';

// Components
import Navbar from './components/Navbar';
import FilterMenu from './components/FilterMenu';
import StatsDataChart from './components/StatsDataChart';

// Material UI
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Grid,
} from '@material-ui/core';

interface IState {
  userID: string;
  stockApiData: any;
  filterMenuState: any;
  filterGameMode?: any;
  filterSeason?: any;
}

export default class Chart extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      userID: localStorage.getItem('_pubgUserID') ? localStorage.getItem('_pubgUserID')! : "UG_boy", // ID設定
      stockApiData: [],
      filterMenuState: null,
      filterGameMode: localStorage.getItem('_pubgGameMode') ? localStorage.getItem('_pubgGameMode')! : "all",
      filterSeason: localStorage.getItem('_pubgFilterSeason') ? localStorage.getItem('_pubgFilterSeason')! : "current-season",
      
    }
  }

  // グラフデータ生成
  componentDidMount() {
    this.createStatsTable();
  }

  // ストックした "_pubgStatsData__*" データからテーブルデータ作るやつ
  public createStatsTable = () => {
    const statsTableData = new StatsData();
    statsTableData.create(this.state.filterSeason)
    .then((value: any) => {
      this.setState({stockApiData: value});
    }, (reason: any) => {
      console.log("statsTableData ないよー => " +  reason);
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
    }, 100)
  }

  render() {
    return (
      <React.Fragment>
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px', backgroundColor: "rgb(64, 64, 64)" }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Toolbar>
              <Navbar userID={this.state.userID} tableUpdate={this.createStatsTable} />
              <Typography variant="h6" component="h1" noWrap>
              Chart
              </Typography>
            </Toolbar>
            <Grid item style={{ flexGrow: 1, textAlign: 'right'}}>
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
          <StatsDataChart chartData={this.state.stockApiData} filterGameMode={this.state.filterGameMode} />
        </Container>
      </React.Fragment>
    );
  }
}