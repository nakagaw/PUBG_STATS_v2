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
  FormControl,
  TextField,
  Grid,
} from '@material-ui/core';

interface IState {
  stockApiData: any;
}

export default class Chart extends React.Component<{}, IState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      stockApiData: []
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
            <Grid item style={{ flexGrow: 1}}>
              <FormControl>
                <TextField
                  id="pubgID"
                  label="ID"
                  // value={this.state.userID}
                  // onChange={this.changeUserID}
                  // disabled={this.state.playingState}
                  placeholder="Placeholder"
                  margin="dense"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth={false}>
          <StatsDataChart chartData={this.state.stockApiData} />
        </Container>
      </React.Fragment>
    );
  }
}