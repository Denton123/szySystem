import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Layout, Breadcrumb, Icon, Button, Calendar, Badge, Spin, Select, message } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'

// 引入工具方法
import { ajax } from 'UTILS/ajax'

const { Content } = Layout
const Option = Select.Option
moment.locale('zh-cn')

class Attendance extends Component {
    state = {
        attendanceData: [],
        calendarTime: null,
        loading: false,
        selectData: [],
        selectedValue: ''
    }
    componentDidMount() {
        this.setState({
            calendarTime: moment().format('YYYY-MM-DD'),
            loading: true
        }, () => {
            this.getSelectData()
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
            this.getAttendanceData(this.state.selectedValue)
        })
    }

    onSelect = (value) => {
        this.setState({
            calendarTime: moment(value).format('YYYY-MM-DD')
        })
        if (!(moment(moment(value).format('YYYY-MM')).isSame(moment(this.state.calendarTime).format('YYYY-MM')))) {
            this.setState({
                loading: true
            }, () => {
                this.getAttendanceData(this.state.selectedValue)
            })
        }
    }

    handleChange = (value) => {
        console.log(`selected ${value}`)
        this.setState({
            loading: true,
            selectedValue: value
        })
        this.getAttendanceData(value)
    }

    getAttendanceData = (value) => {
        var time = this.state.calendarTime
        axios.get(`/api/attendance?time=${time}&realname=${value}`)
            .then(res => {
                console.log('access_token ---- ')
                console.log(res)
                let data = []
                if ((typeof res.data) !== 'string') {
                    if (res.data !== null) {
                        res.data.forEach((arrItem) => {
                            data = [...arrItem, ...data]
                        })
                    }
                    this.setState({
                        attendanceData: data,
                        loading: false
                    })
                } else {
                    message.error(res.data)
                    this.setState({
                        loading: false,
                        attendanceData: []
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    loading: false
                })
                message.error(err.errmsg)
            })
    }

    getSelectData = () => {
        ajax('get', '/user/all')
        .then(res => {
            console.log(res)
            this.setState({
                selectData: res.data,
                loading: false
            })
            message.success('请选择查询的人员姓名')
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
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Spin spinning={this.state.loading}>
                    姓名：<Select style={{ width: 200 }} onChange={this.handleChange} placeholder="请选择查询的人员">
                        {
                            this.state.selectData.map((person) => {
                                return <Option value={person.realname} key={person.id}>{person.realname}</Option>
                            })
                        }
                    </Select>
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
