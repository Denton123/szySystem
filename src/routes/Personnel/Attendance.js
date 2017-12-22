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

class checkwork extends Component {
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
            var data = this.state.calendarTime
            axios.get(`/user/cs?data=${data}`)
                .then(res => {
                    console.log('access_token ---- ')
                    console.log(res)
                    data = []
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
        })
        var time = moment()
        // console.log('time: ' + time)
        // console.log('date: ' + moment(time)['date']())
        // console.log('toArray: ' + moment(time).toArray())
        // console.log('toJSON: ' + moment(time).toJSON())
        // console.log('toISOString: ' + moment(time).toISOString())
        // console.log(moment(time).toObject())
        // console.log('toString: ' + moment(time).toString())
        // console.log('weeksInYear: ' + moment(time).weeksInYear())
        // console.log('isoWeeksInYear: ' + moment(time).isoWeeksInYear())
        // console.log('month: ' + moment(time).startOf('month').format("YYYY-MM-DD"))
        // console.log('month: ' + moment(time).endOf('month').format("YYYY-MM-DD"))
        // console.log('day: ' + moment(time).startOf('month').day())
        // var to=moment(time).endOf('month').format("YYYY-MM-DD")+" 23:59:59"
    }
    getListData = (value) => {
        let oneDayArr = []
        this.state.attendanceData.forEach(item => {
            if (moment(moment(value).format('YYYY-MM-DD')).isSame(moment(item.userCheckTime).format('YYYY-MM-DD'))) {
                let tip = {type: '', content: ''}
                switch (item.timeResult) {
                    case 'Normal':
                        tip = {type: 'success', content: '正常'}
                        break
                    case 'Early':
                        tip = {type: 'warning', content: '早退'}
                        break
                    case 'Late':
                        tip = {type: 'warning', content: '迟到'}
                        break
                    case 'SeriousLate':
                        tip = {type: 'warning', content: '严重迟到'}
                        break
                    case 'NotSigned':
                        tip = {type: 'warning', content: '未打卡'}
                        break
                }
                oneDayArr.push({ type: tip.type, content: `${moment(item.userCheckTime).format('YY-MM-DD, h:mm')}${tip.content}` })
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
                        <li key={item.content}>
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
            var data = this.state.calendarTime
            axios.get(`/user/cs?data=${data}`)
                .then(res => {
                    data = []
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
        })
        console.log('value: ' + moment(value).format('YYYY-MM-DD'))
    }

    onSelect = () => {
        console.log(22)
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
export default checkwork
