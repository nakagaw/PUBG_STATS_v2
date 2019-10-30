import * as React from 'react';

// Classes
import { LocalStorageControls } from './classes/LocalStorageControls';

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
  // ここは Chartようにシーズンフィルターなしに変更してる
  public createStatsTable = () => {
    const statsTableKeys: any =  new LocalStorageControls().summarizeStatsDataKeys();
    let statsTableData: any = {};
    // シーズンフィルタ
    const seasonDate: any = {
      "current-season" : ["2019/10/22","2020/01/30"],
      "season-4" : ["2019/07/24","2019/10/22"]
    }
    for (let i = 0; i < statsTableKeys.length; i++) {
      let _statsTableData = JSON.parse(localStorage.getItem(statsTableKeys[i])!);
      const _filterSeason = this.state.filterSeason;
      const seasonStart = new Date(seasonDate[_filterSeason][0]);
      const seasonEnd = new Date(seasonDate[_filterSeason][1]);
      const playedDate = new Date(_statsTableData.playedDate);
      if ( seasonStart < playedDate && seasonEnd >= playedDate) {
        // シーズン内に該当するデータだけを配列追加
        statsTableData[statsTableKeys[i]] = _statsTableData;
      }
    }
    if(statsTableData !== null){
      this.setState({stockApiData: statsTableData});
    }
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

  // // フィルターボタン
  // public filterMenuClick = (event: React.MouseEvent<HTMLDataElement>) => {
  //   this.setState({filterMenuState: event.currentTarget});
  // }
  // public filterMenuClose = (event?: any) => {
  //   this.setState({filterMenuState: null});
  // }
  // public filterKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log((event.target as HTMLInputElement).value);
  //   this.setState({filterGameMode: (event.target as HTMLInputElement).value});
  //   this.createStatsTable(); //データ再描画
  //   this.filterMenuClose();
  // }

  render() {
    return (
      <React.Fragment>
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px' }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Toolbar>
              <Navbar userID={this.state.userID} />
              <Typography variant="h6" component="h1" noWrap>
              Chart
              </Typography>
            </Toolbar>
            <Grid item style={{ flexGrow: 1, textAlign: 'right'}}>
{/*               
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
                <RadioGroup aria-label="gender" name="filter" value={this.state.filterGameMode} onChange={this.filterKeyChange} 
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
              </Menu> */}
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