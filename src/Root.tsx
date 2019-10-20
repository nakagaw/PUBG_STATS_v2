import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import Chart from './Chart';

import {
  createMuiTheme,
  CssBaseline,
} from '@material-ui/core';

import { ThemeProvider } from '@material-ui/styles';
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default class Root extends React.Component {
  render() {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Route exact path='/' component={App}/>
          <Route exact path='/Chart' component={Chart}/>
        </ThemeProvider>
      </Router>
    )
  }
}
