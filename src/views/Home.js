import React from 'react'
import {
    Route,
    Link,
    Switch
} from 'react-router-dom'

import BasicLayout from '../layouts/BasicLayout.js'

class Home extends React.Component {
    componentDidMount() {
        // 判断用户是否登录
        if (this.props.user === null) {
            this.props.history.push('/login')
        }
    }

    render() {
        return (
            <BasicLayout {...this.props} />
        )
    }
}

export default Home
