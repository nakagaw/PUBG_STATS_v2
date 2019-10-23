import * as React from 'react';

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
  stockApiData: any;
  filterMenuState: any;
  filterKey?: any;
}

export default class Chart extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      stockApiData: [],
      filterMenuState: null,
      filterKey: "all",
    }
  }

  // グラフデータ生成
  componentDidMount() {
    this.createStatsTable();
  }

  // ストックした "_pubgStatsData__*" データからテーブルデータ作るやつ
  public createStatsTable = () => {
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
    return (
      <React.Fragment>
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px' }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Toolbar>
              <Navbar />
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
          <StatsDataChart chartData={this.state.stockApiData}  filterKey={this.state.filterKey} />
        </Container>
      </React.Fragment>
    );
  }
}