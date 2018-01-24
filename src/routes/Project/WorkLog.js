/**
 * 工作日志
 */
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Calendar, Avatar, Popover } from 'antd'
import moment from 'moment'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

const { Content } = Layout

class WorkLog extends Component {
    state = {
        log: [],
        date: this.props.location.state ? this.props.location.state.date : moment().format('YYYY-MM-DD'),
        mode: this.props.location.state ? this.props.location.state.mode : 'month'
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        ajax('get', '/worklog/all').then(res => {
            this.setState({
                log: res.data
            })
        })
    }
    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        const logData = this.state.log
        var Arr = []
        var timeArr = []
        var i = 0
        if (logData !== null) {
            for (i in logData) {
                if (logData[i].time !== null) {
                    var time = moment(logData[i].time).format('YYYY-MM-DD')
                    if (timeArr.indexOf(time) === -1) {
                        timeArr.push(time)
                        var saveObj = {
                            onlytime: time,
                            subContent: []
                        }
                        Arr.push(saveObj)
                    }
                    for (let j in Arr) {
                        if (moment(logData[i].time).format('YYYY-MM-DD') === Arr[j].onlytime) {
                            Arr[j].subContent.push({
                                cont: logData[i].content,
                                avatar: logData[i].User.avatar,
                                name: logData[i].User.realname
                            })
                        }
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
                                {
                                    item.avatar ? <Avatar src={`/uploadImgs/${item.avatar}`} icon="user" /> : <Avatar icon="user" />
                                }
                            </span>
                        </Popover>
                    ))
                )
            }
        }
    }

    onPanelChange = (date, mode) => {
        let dateMoment = moment(date).format('YYYY-MM-DD')
        this.setState({
            date: dateMoment,
            mode: mode
        })
        this.props.history.replace(this.props.location.pathname, {
            date: dateMoment,
            mode: mode
        })
    }
    onSelect = (value) => {
        const onSelectDay = moment(value).format('YYYY-MM-DD')
        this.props.history.replace(this.props.location.pathname, {
            date: onSelectDay
        })
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
                        dateCellRender={this.dateCellRender}
                        defaultValue={moment(this.state.date)}
                        onPanelChange={this.onPanelChange}
                        mode={this.state.mode}
                        onSelect={this.onSelect} />
                </div>
            </Content>
        )
    }
}
export default WorkLog
