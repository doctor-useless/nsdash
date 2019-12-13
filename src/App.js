import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import netlifyIdentity from 'netlify-identity-widget'
import './App.css'
import AppHeader from './components/AppHeader'
import Contacts from './components/Contacts'
import Home from './components/Home'
import PrivateRoute from './components/PrivateRoute'
import { getCurrentUser, loginUser, logoutUser } from './utils/auth'

export default class App extends Component {
  state = { user: null }
  componentDidMount() {
    netlifyIdentity.init();
    const user = getCurrentUser();
    if (user) {
      this.setState({user: user});
    } else {
      loginUser();
    }
    netlifyIdentity.on("login", user => this.setState({user}, loginUser()));
    netlifyIdentity.on("logout", () => this.setState({user: null}, logoutUser()));
  }
  render() {
    return (
      <div className='app'>
        <BrowserRouter>
          <AppHeader user={this.state.user}/>
          <Switch>
            <Route exact path='/' render={() => <Home />} />
            <PrivateRoute exact path='/contacts' component={Contacts} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
