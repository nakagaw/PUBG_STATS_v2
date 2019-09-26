import * as React from 'react';
// import axios from 'axios';

import {
  createStyles,
  Theme,
  makeStyles
} from '@material-ui/core/styles';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

// ============================================
// axios
// ============================================
// const APIKEY = process.env.REACT_APP_PUBG_API_KEY;
// const HOSTNAME = 'https://api.pubg.com/';

// ============================================
// ============================================
// Create Data table
// ============================================

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#f1f1f1',
    },
    paper: {
      marginTop: theme.spacing(3),
      width: '100%',
      overflowX: 'auto',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
  }),
);

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function StatsDataTable() {
  const classes = useStyles();
  return (
    <Table className={classes.table} size="small">
      <TableHead className={classes.head}>
        <TableRow>
          <TableCell>Dessert (100g serving)</TableCell>
          <TableCell align="right">Calories</TableCell>
          <TableCell align="right">Fat&nbsp;(g)</TableCell>
          <TableCell align="right">Carbs&nbsp;(g)</TableCell>
          <TableCell align="right">Protein&nbsp;(g)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.calories}</TableCell>
            <TableCell align="right">{row.fat}</TableCell>
            <TableCell align="right">{row.carbs}</TableCell>
            <TableCell align="right">{row.protein}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// // ============================================
// // ============================================

// interface State {
//   value: string;
//   userID: string;
// }

// export default class Root extends React.Component {
//   public state: State = {
//     value: "",
//     userID: ""
//   }

//   componentDidMount() {
//     root.on("value", snapshot => this.setState({ value: snapshot.val().value}))
//     this.setState({ userID: "UG_boy"})
//   }

//   public changeValue= (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({value: event.target.value});
//   }

//   public valueUpdate = (event: React.FormEvent<HTMLFormElement>) => {
//     root.set({
//       value: this.state.value
//     })
//     .then(() => {
//       console.log("update ok");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//     event.preventDefault();
//   }

//   // Players API から match id を取り出す
//   // ============================================
//   public getAPI = async (url: string) => {
//     try {
//       const res = await axios.get(url, {
//         baseURL: HOSTNAME,
//         headers: {
//           Authorization: APIKEY,
//           Accept: 'application/vnd.api+json'
//         },
//         responseType: 'json'
//       });
//       return res;
//     } catch (error) {
//       console.error('getAPI ERROR!! =>' + error);
//     }
//     return null;
//   }

//   // match ID から 各試合の細かい情報をとってデータまとめる
//   // ============================================
//   public changeUserID = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({userID: event.target.value});
//   }

//   public getMatches = async (event?: any) => {
//     if(event){
//       let playerDataGetResult = await this.getAPI('/shards/steam/players?filter[playerNames]=' + this.state.userID);
//       console.log("きてる 2 " + JSON.stringify(playerDataGetResult));
//     }
//   }


//   render() {
//     return (
//       <div>
//         <CssBaseline />
//         <AppBar position="sticky" style={{ padding: '10px 30px', marginBottom: '30px' }}>
//           <Typography variant="h6" component="h1" noWrap>
//             Hello world
//           </Typography>
//         </AppBar>
//         <Container>
//           <FormControl>
//             <TextField
//               id="pubgID"
//               label="PUBG ID"
//               value={this.state.userID}
//               onChange={this.changeUserID}
//               placeholder="Placeholder"
//               helperText="PleaseInput your PUBG ID"
//               fullWidth
//               margin="dense"
//               variant="outlined"
//             />
//           </FormControl>
//           <Button variant="contained" color="primary"　size="large" style={{ marginLeft: '16px', marginTop: '6px' }} onClick={this.getMatches}>Get PUBG API!!</Button>

//           <Paper>
//             <DenseTable />
//           </Paper>
//         </Container>
//       </div>
//     );
//   }
// }
