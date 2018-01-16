/**
 * 工作日志
 */
import React, {Component} from 'react'
import {
    Layout,
    Icon,
    Calendar,
    Avatar,
    Popover
} from 'antd'
import {valueToMoment, momentToValue, formatDate, resetObject, getTime} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'
const { Content } = Layout

class WorkLog extends Component {
    state = {
        log: [],
        date: this.props.location.state && this.props.location.state.date ? valueToMoment(this.props.location.state.date) : valueToMoment(formatDate()),
        mode: this.props.location.state && this.props.location.state.mode ? this.props.location.state.mode : 'month'
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        ajax('get', '/worklog/all').then(res => {
            let arr = []
            res.data.forEach(d => {
                arr.push(resetObject(d))
            })
            this.setState({
                log: arr
            })
        })
    }
    dateCellRender = (moment) => {
        const cellDate = momentToValue(moment)
        let currentDateLog = [] // 记录当天全部用户日志
        this.state.log.forEach(log => {
            if (log.date === cellDate) {
                currentDateLog.push(log)
            }
        })
        return (
            currentDateLog.map(item => (
                <Popover content={item.content} title={item.realname} key={item.id}>
                    <span style={{marginRight: '10px'}}>
                        {
                            item.avatar ? <Avatar src={`/uploadImgs/${item.avatar}`} /> : <Avatar icon="user" />
                        }
                    </span>
                </Popover>
            ))
        )
    }
    // dateCellRender = (value) => {
    //     const cellDate = moment(value).format('YYYY-MM-DD')
    //     const logData = this.state.log
    //     var Arr = []
    //     var timeArr = []
    //     var i = 0
    //     if (logData !== null) {
    //         for (i in logData) {
    //             if (logData[i].time !== null) {
    //                 var time = moment(logData[i].time).format('YYYY-MM-DD')
    //                 if (timeArr.indexOf(time) === -1) {
    //                     timeArr.push(time)
    //                     var saveObj = {
    //                         onlytime: time,
    //                         subContent: []
    //                     }
    //                     Arr.push(saveObj)
    //                 }
    //                 for (let j in Arr) {
    //                     if (logData[i].time.substr(0, 10) === Arr[j].onlytime) {
    //                         Arr[j].subContent.push({
    //                             cont: logData[i].content,
    //                             avatar: logData[i].User.avatar,
    //                             name: logData[i].User.realname
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     for (let id in Arr) {
    //         if (cellDate === Arr[id].onlytime) {
    //             return (
    //                 Arr[id].subContent.map(item => (
    //                     <Popover content={item.cont} title={item.name} key={item.cont}>
    //                         <span style={{marginRight: '10px'}}>
    //                             {
    //                                 item.avatar ? <Avatar src={`/uploadImgs/${item.avatar}`} icon="user" /> : <Avatar icon="user" />
    //                             }
    //                         </span>
    //                     </Popover>
    //                 ))
    //             )
    //         }
    //     }
    // }
    onPanelChange = (moment, mode) => {
        this.setState({
            date: momentToValue(moment),
            mode: mode
        })
        this.props.history.replace(this.props.location.pathname, {
            date: momentToValue(moment),
            mode: mode
        })
    }
    onSelect = (moment) => {
        this.props.history.replace(this.props.location.pathname, {
            date: momentToValue(moment),
            mode: this.state.mode
        })
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
            <Content style={{ margin: '0 16px' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Calendar
                        dateCellRender={this.dateCellRender}
                        disabledDate={this.disabledDate}
                        onPanelChange={this.onPanelChange}
                        defaultValue={valueToMoment(this.state.date)}
                        mode={this.state.mode}
                        onSelect={this.onSelect}
                    />
                </div>
            </Content>
        )
    }
}
export default WorkLog
