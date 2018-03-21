import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, DatePicker, Calendar, WhiteSpace } from 'antd-mobile'
import moment from 'moment'

import {ajax} from '../../../utils/ajax'
import {isArray, getTime} from '../../../utils/utils'

class Attendance extends React.Component {
    state = {
        date: new Date(Date.now()),
        // attendanceData: [],
        // loading: false,
        // calendarTime: this.props.location.state ? this.props.location.state.calendarTime : moment().format('YYYY-MM-DD'),
        // mode: this.props.location.state ? this.props.location.state.mode : 'month'
    }
    componentWillMount() {
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
        let params = {
            time: this.state.date,
            realname: this.props.user.realname
        }
        ajax('get', '/api/attendance', params)
            .then(res => {
                console.log(res)
            })
        // axios.get(`/api/attendance?time=${time}&realname=${this.props.user.realname}`)
        //     .then(res => {
        //         let data = []
        //         if (isArray(res.data)) {
        //             res.data.forEach((arrItem) => {
        //                 data = [...arrItem, ...data]
        //             })
        //             if (data.length === 0) {
        //                 message.warning('该用户暂无考勤记录')
        //             }
        //         } else {
        //             message.error(res.data)
        //         }
        //         this.setState({
        //             attendanceData: data,
        //             loading: false
        //         })
        //     })
        //     .catch(err => {
        //         this.setState({
        //             loading: false
        //         })
        //         message.error(err.errmsg)
        //     })
    }

    disabledDate = (moment) => {
        return getTime() < getTime(moment)
    }
    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props
        return (
            <List>
                <DatePicker
                    mode="date"
                    value={this.state.date}
                    maxDate={new Date(Date.now())}
                    onChange={date => this.setState({ date })}
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace />
            </List>
        )
    }
}

export default Attendance
