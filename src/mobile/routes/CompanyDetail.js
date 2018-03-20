import React from 'react'
import { Grid, Icon } from 'antd-mobile'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

class Company extends React.Component {
    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes
        } = this.props
        return (
            <div style={{ padding: 24, background: '#fff' }}>
                detail
            </div>
        )
    }
}
export default Company
