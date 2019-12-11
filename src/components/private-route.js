import React from 'react'
import { Route } from 'react-router-dom'
import { SignIn } from './sign-in'
import { isAuthenticated } from '../utils/auth'

export default function PrivateRoute({ component, ...options }) {
    const finalComponent = isAuthenticated() ? component : SignIn;
  
    return <Route {...options} component={finalComponent} />;
  };