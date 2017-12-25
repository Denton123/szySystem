import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

const { Content } = Layout

class Attendance extends Component {
    render() {
        console.log(this.props)
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Button type="primary">考勤</Button>
            </div>
        )
    }
}
export default Attendance
