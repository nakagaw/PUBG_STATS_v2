import * as React from 'react';

// Components
import Navbar from './Navbar';

// Material UI
import {
  createMuiTheme,
  CssBaseline,
  AppBar,
  Container,
  Typography,
  // FormControl,
  // TextField,
  // IconButton,
  // Button,
  // Switch,
  // Paper,
  Grid,
} from '@material-ui/core';

import { ThemeProvider } from '@material-ui/styles';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default class Graph extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="sticky" style={{ padding: '4px 20px 6px', marginBottom: '15px' }}>
          <Grid container alignItems="center" wrap="nowrap" spacing={4}>
            <Grid item>
              <Typography variant="h6" component="h1" noWrap>
                Graph
              </Typography>
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
            </Grid>
            <Grid item>
              <Navbar />
            </Grid>
          </Grid>
        </AppBar>
        <Container maxWidth={false}>
        </Container>
      </ThemeProvider>
    );
  }
}