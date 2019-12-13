import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import netlifyIdentity from 'netlify-identity-widget'

export class SignIn extends Component {
  componentDidMount() {
    netlifyIdentity.open()
  }
  render() {
    return (
      <Redirect to="/" />
    )
  }
}
