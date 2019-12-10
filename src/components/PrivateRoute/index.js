import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../utils/auth';

export default function PrivateRoute({ component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <component {...props} />
                ) : (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );
}