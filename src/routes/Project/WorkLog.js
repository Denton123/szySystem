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
import moment from 'moment'
import ReactQuill from 'react-quill'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const { Content } = Layout

class checkwork extends Component {
    state = {
        userData: [],
        log: [],
        avatar: null
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        // 获取全部的user
        ajax('get', '/user/all').then(res => {
            console.log(res.data)
            this.setState({
                userData: res.data
            })
        })
        // 获取全部的log
        index('/worklog').then(res => {
            console.log(res)
            this.setState({
                log: res.data
            })
        })
    }
    showLog = () => {
        console.log('wawaw')
    }
    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        const logData = this.state.log
        if (logData !== null) {
            for (let i in logData) {
                var time = logData[i].time.substr(0, 10)
                if (cellDate === time) {
                    console.log(logData[i].content)
                }
            }
        }
        const content = (
            <p>圣诞快乐</p>
        )
        const userData = this.state.userData
        // if (value.date() === 5) {
        //     return (
        //         userData.map(item => (
        //             <Popover content={content} title="舒丹彤" trigger="click" key={item.id}>
        //                 <Avatar src={`/uploadImgs/${item.avatar}`} />
        //             </Popover>
        //         ))
        //     )
        // }
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
