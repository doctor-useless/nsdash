import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

export default function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          netlifyAuth.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
        }
      />
    );
  }