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
        log: [],
        avatar: null,
        subcontent: []
    }

    componentWillMount() {
        this.getLogData()
    }

    getLogData = () => {
        ajax('get', '/user/all').then(res => {
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
    }
    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        const logData = this.state.log
        var popcontent, content, avatar, realname, testname, testTime, test
        var avatarArr = []
        var testArr = []
        var Arr = []
        for (var i = 0; i < logData.length; i++) {
            var time = logData[i].time.substr(0, 10)
            var count = 0
            for (var j = 0; j < logData.length; j++) {
                if (logData[j].time === logData[i].time) {
                    count++
                    if (count > 1) {
                        Arr.push(logData[j])
                        console.log(Arr)
                    }
                }
            }
            var saveObj = {
                time: time,
                cont: [],
                name: [],
                avatar: []
            }
            testArr.push(saveObj)
            if (cellDate === time) {
                content = (
                    <p>{logData[i].content}</p>
                )
                return (
                    <Popover content={content} title={logData[i].User.realname} trigger="click">
                        <Avatar src={`/uploadImgs/${logData[i].User.avatar}`} />
                    </Popover>
                )
            }
        }
        // for (let y in testArr) {
        //     if (cellDate === testArr[y].time) {
        //         return (
        //             testArr[y].cont.map(id => (
        //                 <p>{id.content}</p>
        //             ))
        //         )
        //     }
        // }
        // var testTime
        // console.log(testArr)
        // for (var u = 0; u < testArr.length; u++) {
        //     var test = testArr[u + 1]
        //     if (test !== undefined) {
        //         testTime = test.time
        //     }
        //     if (testArr[u].time === testTime) {
        //         console.log(testTime)
        //         Arr.push(testArr[u].cont)
        //     }
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
                    <Calendar
                        dateCellRender={this.dateCellRender}
                        onSelect={this.showLog} />
                </div>
            </Content>
        )
    }
}
export default checkwork
