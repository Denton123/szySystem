import React from 'react'
import { List, DatePicker, WhiteSpace, Toast } from 'antd-mobile'
import moment from 'moment'

import {ajax} from '../../../utils/ajax'
import {isArray, getTime} from '../../../utils/utils'

class Attendance extends React.Component {
    state = {
        date: null,
        attendanceData: [], // 当月全部的考勤状况
        todayData: [], // 当天考勤状况
        currentYM: '', // 当前年月
    }
    componentWillMount() {
        this.getAttendanceData(new Date(Date.now()))
    }

    getAttendanceData = (date) => {
        Toast.loading('加载中', 0)
        let params = {
            time: date,
            realname: this.props.user.realname
        }
        ajax('get', '/m/api/attendance', params)
            .then(res => {
                let data = [], todayData = []
                if (isArray(res.data)) {
                    res.data.forEach((arrItem) => {
                        data = [...arrItem, ...data]
                    })
                } else {
                    Toast.info(res.data, 1)
                }
                data.forEach(d => {
                    // 时间相同的话则添加到今天的数组里
                    if (moment(d.workDate).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                        todayData.push(d)
                    }
                })
                this.setState({
                    date,
                    attendanceData: data,
                    todayData,
                    currentYM: moment(date).format('YYYY-MM'),
                })
                Toast.hide()
            })
    }

    onDateChange = (date) => {
        if (moment(date).format('YYYY-MM') === this.state.currentYM) {
            let todayData = []
            this.state.attendanceData.forEach(d => {
                // 时间相同的话则添加到今天的数组里
                if (moment(d.workDate).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')) {
                    todayData.push(d)
                }
            })
            this.setState({
                date,
                todayData: todayData,
            })
        } else {
            this.getAttendanceData(date)
        }
    }

    render() {
        const {
            date,
            todayData,
        } = this.state
        const duty = {
            OnDuty: '上班',
            OffDuty: '下班',
        }
        const result = {
            Normal: '正常',
            Early: '早退',
            Late: '迟到',
            SeriousLate: '严重迟到',
            NotSigned: '未打卡',
        }
        return (
            <List>
                <DatePicker
                    mode="date"
                    value={date}
                    maxDate={new Date(Date.now())}
                    onChange={this.onDateChange}
                >
                    <List.Item arrow="horizontal">日期</List.Item>
                </DatePicker>
                <WhiteSpace />
                <List.Item>{`${date ? moment(date).format('YYYY-MM-DD') : ''}考勤`}</List.Item>
                {todayData.length > 0 ? (
                    <div>
                        {todayData.map(td => (
                            <List.Item key={td.id} extra={duty[td.checkType]}>
                                {`打卡时间:${moment(td.userCheckTime).format('HH:mm')} ${result[td.timeResult]}`}
                            </List.Item>
                        ))}
                    </div>
                ) : (
                    <List.Item>当天无打卡记录</List.Item>
                )}
            </List>
        )
    }
}

export default Attendance
