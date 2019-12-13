import React, { Component}  from 'react'
import { Link } from 'react-router-dom'
import netlifyIdentity from 'netlify-identity-widget'
import logo from '../../assets/logo.svg'
import './styles.css'

export default class AppHeader extends Component {
  logout() {
    netlifyIdentity.logout();
  }
  login() {
    netlifyIdentity.open();
  }
  render() {
    return (
      <header className='app-header'>
        <div className='app-title-wrapper'>
          <div className='app-left-nav'>
            <img src={logo} className='app-logo' alt='logo' />
            <div className='app-title-text'>
              <h1 className='app-title'>Dashboard</h1>
              <p className='app-intro'>Manage enquiries, shared albums and more.</p>
            </div>
          </div>
        </div>
        <div className='app-routes'>
          <Link to='/'>Home</Link>
          <Link to='/contacts'>Contacts</Link>
        </div>
        <div className='app-user'>
          <Greeting user={this.props.user} login={this.login} logout={this.logout}/>
        </div>
      </header>
    )
  }
}

function UserGreeting(props) {
  return (
    <div>
      <h1>Hey {props.user.id}</h1>
      <button onClick={props.logout}>log out</button>
    </div>
    );
}
function GuestGreeting(props) {
  return <button onClick={props.login}>log in</button>
}
function Greeting(props) {
  if (props.user) {
    return <UserGreeting user={props.user} logout={props.logout}/>
  }
  return <GuestGreeting login={props.login}/>
}