import React, { Component } from 'react';
import './App.css';
import {Router,Route,Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Error404 from './Components/Error404';

const customHistory = createBrowserHistory()

class App extends Component {
  render() {
    return (
        <Router history={customHistory}>
          <div className="App">
          <Switch>
            <Route exact path="/" component={Login}> </Route>
            <Route path="/dashboard/:oke" component={Dashboard}></Route>
            <Route path="/dashboard" component={Dashboard}></Route>            
            <Route component={Error404} ></Route>
          </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
