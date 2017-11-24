import React from 'react'
import {
    Route,
    Link,
    Switch
} from 'react-router-dom'

import BasicLayout from '../layouts/BasicLayout.js'

class Home extends React.Component {
    render() {
        const match = this.props.match
        const history = this.props.history
        const location = this.props.location
        const routes = this.props.routes
        return (
            <BasicLayout {...this.props} />
        )
    }
}

export default Home
