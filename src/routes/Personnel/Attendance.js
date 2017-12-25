import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Layout, Breadcrumb, Icon, Button, Calendar, Badge, Spin } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'

const { Content } = Layout
moment.locale('zh-cn')

class Attendance extends Component {
    state = {
        attendanceData: [],
        calendarTime: null,
        loading: false
    }
    componentDidMount() {
        this.setState({
            calendarTime: moment().format('YYYY-MM-DD'),
            loading: true
        }, () => {
            this.requestData()
        })
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

    getMonthData = (value) => {
        if (value.month() === 8) {
            return 1394
        }
    }

    // 自定义渲染月单元格，返回内容会被追加到单元格
    monthCellRender = (value) => {
        const num = this.getMonthData(value)
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null
    }

    // 日期面板变化回调
    onPanelChange = (value) => {
        this.setState({
            calendarTime: moment(value).format('YYYY-MM-DD'),
            loading: true
        }, () => {
            this.requestData()
        })
    }

    onSelect = (value) => {
        this.setState({
            calendarTime: moment(value).format('YYYY-MM-DD'),
            loading: true
        }, () => {
            this.requestData()
        })
    }

    requestData = () => {
        var time = this.state.calendarTime
        axios.get(`/user/cs?time=${time}`)
            .then(res => {
                console.log('access_token ---- ')
                console.log(res)
                let data = []
                if (res.data !== []) {
                    res.data.forEach((arrItem) => {
                        data = [...arrItem, ...data]
                    })
                }
                this.setState({
                    attendanceData: data,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    render() {
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Spin spinning={this.state.loading} size="large">
                    <Calendar
                        dateCellRender={this.dateCellRender}
                        monthCellRender={this.monthCellRender}
                        onPanelChange={this.onPanelChange}
                        onSelect={this.onSelect}
                    />
                </Spin>
            </div>
        )
    }
}
export default Attendance
