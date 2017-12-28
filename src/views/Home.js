import React from 'react'
import {
    Route,
    Link,
    Switch
} from 'react-router-dom'

import {ajax} from 'UTILS/ajax'

import BasicLayout from '../layouts/BasicLayout.js'

class Home extends React.Component {
    state = {
        permissionRoute: []
    }
    componentWillMount() {
        // 判断用户是否登录
        if (this.props.user === null) {
            this.props.history.push('/login')
        } else {
            ajax('get', '/permission/all-menu')
            .then(res => {
                this.setState({
                    permissionRoute: res.data
                })
            })
        }
    }
    render() {
        return (
            <BasicLayout {...this.props} permissionRoute={this.state.permissionRoute} />
        )
    }
}

export default Home
