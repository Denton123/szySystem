/**
 * 工作日志
 */
import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Calendar, Avatar, Popover } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

const { Content } = Layout

class checkwork extends Component {
    state = {
        userData: [],
        note: [],
        avatar: null
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        ajax('get', '/user/all').then(res => {
            console.log(res.data)
            this.setState({
                userData: res.data
            })
        })
    }
    showLog = () => {
        console.log('wawaw')
    }
    dateCellRender = (value) => {
        const content = (
            <p>圣诞快乐</p>
        )
        const userData = this.state.userData
        if (value.date() === 5) {
            return (
                userData.map(item => (
                    <Popover content={content} title="舒丹彤" trigger="click" key={item.id}>
                        <Avatar src={`/uploadImgs/${item.avatar}`} />
                    </Popover>
                ))
            )
        }
    }
    render() {
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Calendar dateCellRender={this.dateCellRender} />
                </div>
            </Content>
        )
    }
}
export default checkwork
