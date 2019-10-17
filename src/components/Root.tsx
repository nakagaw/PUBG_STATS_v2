import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navbar from './Navbar';
import App from './App';
import Graph from './Graph';

export default class Root extends React.Component {
  render() {
    return (
      <Router>
          <Route exact path='/' component={App}/>
          <Route path='/Graph' component={Graph}/>
      </Router>
    )
  }
}
