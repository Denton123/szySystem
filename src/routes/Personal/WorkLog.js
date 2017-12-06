import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Calendar, Alert, Input, Badge } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
import moment from 'moment'
import PopModal from 'COMPONENTS/modal/modal.js'
import 'ROUTES/Personal/WorkLog.less'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

const { TextArea } = Input
const { Content } = Layout

class checkwork extends Component {
    state = {
        show: false,
        text: '',
        log: '',
        day: '',
        note: [],
        id: 0
    }

    handleok = (content) => {
        console.log(content)
        this.setState({
            show: false,
            log: content
        })
        localStorage.setItem('logcont', content)
        var selectDay = localStorage.getItem('recordDay')
        var saveObj = {
            index: this.state.id++,
            content: content,
            selectDay: selectDay
        }
        var note = this.state.note
        console.log(this.state.note)
        note.push(saveObj)
        let saveStr = JSON.stringify(note)
        console.log(saveStr)
        localStorage.setItem('localData', saveStr)
    }

    onCancel = (e) => {
        this.setState({
            show: false
        })
    }

    onSelect = (value) => {
        // this.day(value)
        const test = this.day(value)
        console.log(test + '==========')
        this.setState({
            show: true,
            day: value.date()
        })
        localStorage.setItem('recordDay', value.date())
        const da = localStorage.getItem('recordDay')
    }

    day = (value) => {
        const localStr = localStorage.getItem('localData')
        const localArr = JSON.parse(localStr)
        for (let i in localArr) {
            console.log(localArr[i].selectDay + '...')
            return localArr[i].selectDay
        }
    }

    dateCellRender = (value) => {
        const test = value.date()
        if (test % 2 === 0) {
            return (
                <p style={{background: 'yellow'}}>even</p>
            )
        }
    }
    render() {
        const { selectedValue, show, log, content } = this.state
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
                        onSelect={this.onSelect}
                        dateCellRender={this.dateCellRender} />
                    <PopModal show={show} handleok={this.handleok} onCancel={this.onCancel} />
                </div>
            </Content>
        )
    }
}
export default checkwork
