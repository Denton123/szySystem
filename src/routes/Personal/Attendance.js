import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Layout, Breadcrumb, Icon, Button, Calendar, Badge, Spin, message } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {isArray, getTime} from 'UTILS/utils'

const { Content } = Layout
moment.locale('zh-cn')

class Attendance extends Component {
    state = {
        attendanceData: [],
        loading: false,
        calendarTime: this.props.location.state ? this.props.location.state.calendarTime : moment().format('YYYY-MM-DD'),
        mode: this.props.location.state ? this.props.location.state.mode : 'month'
    }

    componentDidMount() {
        this.getAttendanceData()
    }

    getListData = (value) => {
        let oneDayArr = []
        this.state.attendanceData.forEach(item => {
            if (moment(moment(value).format('YYYY-MM-DD')).isSame(moment(item.userCheckTime).format('YYYY-MM-DD'))) {
                let tip = {type: '', content: '', checkType: ''}
                switch (item.checkType) {
                    case 'OnDuty':
                        tip.checkType = '上班'
                        break
                    case 'OffDuty':
                        tip.checkType = '下班'
                        break
                }
                switch (item.timeResult) {
                    case 'Normal':
                        tip.type = 'success'
                        tip.content = '正常'
                        break
                    case 'Early':
                        tip.type = 'warning'
                        tip.content = '早退'
                        break
                    case 'Late':
                        tip.type = 'warning'
                        tip.content = '迟到'
                        break
                    case 'SeriousLate':
                        tip.type = 'warning'
                        tip.content = '严重迟到'
                        break
                    case 'NotSigned':
                        tip.type = 'warning'
                        tip.content = '未打卡'
                        break
                }
                oneDayArr.push({ type: tip.type, content: `${tip.checkType} ${moment(item.userCheckTime).format('h:mm')} ${tip.content}` })
            }
        })
        return oneDayArr
    }

    // 自定义渲染日期单元格，返回内容会被追加到单元格
    dateCellRender = (value) => {
        var listData = this.getListData(value)
        return (
            <ul className="events">
                {
                    listData.map(item => (
                        <li key={item.content} style={{'listStyleType': 'none'}}>
                            <Badge status={item.type} text={item.content} />
                        </li>
                    ))
                }
            </ul>
        )
    }

    // 日期面板变化回调
    onPanelChange = (value, mode) => {
        let calendarTime = moment(value).format('YYYY-MM-DD')
        this.setState({
            calendarTime: calendarTime,
            mode: mode
        }, () => {
            this.getAttendanceData()
        })
        this.props.history.replace(this.props.location.pathname, {
            calendarTime: calendarTime,
            mode: mode
        })
    }

    onSelect = (value) => {
        let calendarTime = moment(value).format('YYYY-MM-DD')
        this.setState({
            calendarTime: calendarTime
        })
        if (!(moment(moment(value).format('YYYY-MM')).isSame(moment(this.state.calendarTime).format('YYYY-MM')))) {
            this.getAttendanceData()
        }
        this.props.history.replace(this.props.location.pathname, {
            calendarTime: calendarTime,
            mode: this.state.mode
        })
    }

    getAttendanceData = () => {
        if (this.state.mode === 'month') {
            this.setState({
                loading: true
            }, () => {
                var time = this.state.calendarTime
                axios.get(`/api/attendance?time=${time}&realname=${this.props.user.realname}`)
                    .then(res => {
                        let data = []
                        if (isArray(res.data)) {
                            res.data.forEach((arrItem) => {
                                data = [...arrItem, ...data]
                            })
                            if (data.length === 0) {
                                message.warning('该用户暂无考勤记录')
                            }
                        } else {
                            message.error(res.data)
                        }
                        this.setState({
                            attendanceData: data,
                            loading: false
                        })
                    })
                    .catch(err => {
                        this.setState({
                            loading: false
                        })
                        message.error(err.errmsg)
                    })
            })
        }
    }

    disabledDate = (moment) => {
        return getTime() < getTime(moment)
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
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Spin spinning={this.state.loading}>
                    <Calendar
                        dateCellRender={this.dateCellRender}
                        onPanelChange={this.onPanelChange}
                        onSelect={this.onSelect}
                        defaultValue={moment(this.state.calendarTime)}
                        mode={this.state.mode}
                        disabledDate={this.disabledDate}
                    />
                </Spin>
            </div>
        )
    }
}
export default Attendance
