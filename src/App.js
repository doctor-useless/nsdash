import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { IdentityContextProvider } from 'react-netlify-identity'
import './App.css'
import AppHeader from './components/AppHeader'
import Contacts from './components/Contacts'
import Home from './components/Home'
import PrivateRoute from './components/PrivateRoute'
const url = "https://nsdash.netlify.com/"

export default class App extends Component {
  render() {
    return (
      <IdentityContextProvider url={url}>
        <div className='app'>
          <BrowserRouter>
            <AppHeader />
            <Switch>
              <Route exact path='/' render={() => <Home />} />
              <PrivateRoute exact path='/contacts' render={() => <Contacts />} />
            </Switch>
          </BrowserRouter>
        </div>
      </IdentityContextProvider>
    )
  }
}
