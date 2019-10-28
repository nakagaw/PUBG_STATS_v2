import * as React from 'react';

// Classes
import { LocalStorageControls } from './classes/LocalStorageControls';

// Components
import Navbar from './components/Navbar';
import StatsDataChart from './components/StatsDataChart';

// Material UI
import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  FormControlLabel,
  IconButton,
  Grid,
  Menu,
  Radio,
  RadioGroup,
} from '@material-ui/core';

import {
  FilterList,
} from '@material-ui/icons';

interface IState {
  userID: string;
  stockApiData: any;
  filterMenuState: any;
  filterGameMode?: any;
}

export default class Chart extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      userID: localStorage.getItem('_pubgUserID') ? localStorage.getItem('_pubgUserID')! : "UG_boy", // ID設定
      stockApiData: [],
      filterMenuState: null,
      filterGameMode: "all",
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
    for (let i = 0; i < statsTableKeys.length; i++) {
      let _statsTableData = JSON.parse(localStorage.getItem(statsTableKeys[i])!);
      statsTableData[statsTableKeys[i]] = _statsTableData;
    }
    if(statsTableData !== null){
      this.setState({stockApiData: statsTableData});
    }
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
    this.setState({filterGameMode: (event.target as HTMLInputElement).value});
    this.createStatsTable(); //データ再描画
    this.filterMenuClose();
  }

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
              </Menu>
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