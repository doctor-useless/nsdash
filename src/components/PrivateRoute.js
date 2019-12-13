import React from 'react'
import { Route } from 'react-router-dom'
import { SignIn } from './SignIn'
import { getCurrentUser } from '../utils/auth'

export default function PrivateRoute({ component, ...options }) {
    const finalComponent = getCurrentUser() ? component : SignIn;
  
    return <Route {...options} component={finalComponent} />;
  };