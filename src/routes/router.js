import React, {Component} from 'react'
import { Router, Route, Redirect, IndexRoute } from 'react-router'

import index from '../components/index'

class Roots extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

const RouteConfig = (
    <Router>
        <Route path='/' component={Roots}>
            <IndexRoute component={index} />//首页
            <Redirect from='*' to='/' />
        </Route>
    </Router>
)

export default RouteConfig
