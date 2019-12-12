import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'
import AppHeader from './components/AppHeader'
import Contacts from './components/Contacts'
import Home from './components/home'
import PrivateRoute from './components/private-route'
const url = "https://nsdash.netlify.com/"

export default class App extends Component {
  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <AppHeader />
          <Switch>
            <Route exact path='/' render={() => <Home />} />
            <PrivateRoute exact path='/contacts' component={Contacts} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
