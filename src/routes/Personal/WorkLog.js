import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Calendar, Badge, message } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
import moment from 'moment'
import PopModal from 'COMPONENTS/modal/LogModal.js'
import 'ROUTES/Personal/WorkLog.less'
import 'moment/locale/zh-cn'
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
moment.locale('zh-cn')
const { Content } = Layout

class checkwork extends Component {
    state = {
        show: false,
        text: '',
        log: '',
        note: [],
        id: 0,
        content: '',
        title: '',
        checkFlag: ''
    }

    handleok = (content) => {
        if (content === '') {
            this.setState({
                show: true
            })
        } else {
            this.setState({
                show: false
            })
            localStorage.setItem('logcont', content)
            var selectDay = localStorage.getItem('recordDay')
            var saveObj = {
                index: this.state.id++,
                content: content,
                selectDay: selectDay
            }
            var note = this.state.note
            note.push(saveObj)
            let saveStr = JSON.stringify(note)
            localStorage.setItem('localData', saveStr)
            this.state.checkFlag === 'add' ? store('/worklog', saveObj).then(res => {
                message.success('新增日志成功')
                console.log('success')
            }).catch(err => {
                console.log(err)
                message.error('新增日志失败')
            }) : update(`/worklog/${saveObj.index}`, saveObj).then(res => {
                message.success('编辑日志成功')
            }).catch(err => {
                console.log(err)
                message.error('编辑日志失败')
            })
        }
        console.log(this.state.checkFlag)
    }

    onCancel = (e) => {
        this.setState({
            show: false
        })
    }

    onSelect = (value) => {
        const onSelectDay = moment(value).format('YYYY-MM-DD')
        console.log(onSelectDay)
        const localData = localStorage.getItem('localData')
        const localArr = JSON.parse(localData)
        var id
        var arr = []
        if (localArr !== null) {
            for (id in localArr) {
                arr.push(localArr[id].selectDay)
            }
            console.log(arr)
            const checkFlag = arr.indexOf(onSelectDay) // -1不存在，0存在
            if (checkFlag === -1) {
                this.setState({
                    title: '添加日志',
                    checkFlag: 'add'
                })
            } else {
                this.setState({
                    title: '编辑日志',
                    checkFlag: 'edit'
                })
            }
        }
        this.setState({
            show: true
        })
        localStorage.setItem('recordDay', onSelectDay)
        const da = localStorage.getItem('recordDay')
    }

    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        const localStr = localStorage.getItem('localData')
        const localArr = JSON.parse(localStr)
        if (localArr !== null) {
            for (let i in localArr) {
                if (cellDate === localArr[i].selectDay) {
                    localStorage.setItem('hasContent', true)
                    var hasContent = localStorage.getItem('hasContent')
                    return (
                        <div>
                            <p>{localArr[i].content}</p>
                            <Icon type="delete" />
                        </div>
                    )
                }
            }
        }
    }
    render() {
        const { selectedValue, show, title } = this.state
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
                    <PopModal show={show} handleok={this.handleok} onCancel={this.onCancel} title={title} />
                </div>
            </Content>
        )
    }
}
export default checkwork
