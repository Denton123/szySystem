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
        log: []
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        index('/worklog').then(res => {
            // console.log(res)
            this.setState({
                log: res.data
            })
        })
    }
    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        console.log(cellDate)
        const logData = this.state.log
        var Arr = []
        var timeArr = []
        var i = 0
        if (logData !== null) {
            for (i in logData) {
                var time = moment(logData[i].time).format('YYYY-MM-DD')
                console.log(time)
                if (timeArr.indexOf(time) === -1) {
                    timeArr.push(time)
                    var saveObj = {
                        onlytime: time,
                        subContent: []
                    }
                    Arr.push(saveObj)
                }
                for (let j in Arr) {
                    if (logData[i].time.substr(0, 10) === Arr[j].onlytime) {
                        Arr[j].subContent.push({
                            cont: logData[i].content,
                            avatar: logData[i].User.avatar,
                            name: logData[i].User.realname
                        })
                    }
                }
            }
        }
        for (let id in Arr) {
            if (cellDate === Arr[id].onlytime) {
                return (
                    Arr[id].subContent.map(item => (
                        <Popover content={item.cont} title={item.name} key={item.cont}>
                            <span style={{marginRight: '10px'}}>
                                <Avatar src={`/uploadImgs/${item.avatar}`} icon="user" />
                            </span>
                        </Popover>
                    ))
                )
            }
        }
    }
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props
        return (
            <Content style={{ margin: '0 16px' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Calendar
                        dateCellRender={this.dateCellRender} />
                </div>
            </Content>
        )
    }
}
export default checkwork
