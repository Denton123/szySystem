/**
 * 每日日志
 */
import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Calendar, Badge, message, Modal, Spin, Avatar } from 'antd'
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
const confirm = Modal.confirm
class checkwork extends Component {
    state = {
        show: false,
        text: '',
        log: '',
        note: [],
        id: 0,
        content: '',
        title: '',
        checkFlag: '',
        showTip: false,
        logcont: '',
        showDelete: false,
        deleteId: ''
    }

    componentDidMount() {
        this.getLogData()
    }

    getLogData = () => {
        const id = this.props.user.id
        show(`/worklog/${id}`).then(res => {
            this.setState({
                note: res.data
            })
        })
    }
    handleok = (content) => {
        if (content === '') {
            this.setState({
                show: true,
                showTip: true
            })
        } else {
            this.setState({
                show: false,
                showTip: false
            })
            localStorage.setItem('logcont', content)
            var selectDay = localStorage.getItem('recordDay')
            var saveObj = {
                index: this.state.id++,
                id: this.props.user.id,
                content: content,
                selectDay: selectDay
            }
            var note = this.state.note
            if (this.state.checkFlag === 'add') {
                store('/worklog', saveObj).then(res => {
                    if (res.status === 200) {
                        this.getLogData()
                        message.success('新增日志成功')
                    } else {
                        message.error('新增日志失败')
                    }
                })
            } else {
                var i, time, editId
                var okArr = []
                for (i in note) {
                    time = note[i].time.substr(0, 10)
                    if (selectDay === time) {
                        editId = note[i].id
                    }
                }
                update(`/worklog/${editId}`, saveObj).then(res => {
                    if (res.status === 200) {
                        this.getLogData()
                        message.success('编辑日志成功')
                    } else {
                        message.error('编辑日志失败')
                    }
                })
            }
        }
    }

    onCancel = (e) => {
        this.setState({
            show: false,
            showTip: false
        })
    }

    onSelect = (value) => {
        const onSelectDay = moment(value).format('YYYY-MM-DD')
        const localArr = this.state.note
        var id, time, ol, checkFlag, i
        var arr = []
        if (localArr !== null) {
            for (id in localArr) {
                if (localArr[id].time !== null) {
                    time = localArr[id].time.substr(0, 10)
                    arr.push(time)
                }
            }
            checkFlag = arr.indexOf(onSelectDay)
            if (checkFlag === -1) {
                this.setState({
                    title: '新增',
                    checkFlag: 'add',
                    logcont: '',
                    showDelete: false
                })
            } else {
                var testarr = []
                var editContent, atTime
                for (ol in localArr) {
                    if (localArr[ol].time !== null) {
                        var timearr = localArr[ol].time.substr(0, 10)
                        testarr.push(timearr)
                        var Flag = timearr.indexOf(onSelectDay)
                        if (Flag === 0) {
                            editContent = localArr[ol].content
                        }
                    }
                }
                for (i in localArr) {
                    atTime = localArr[i].time.substr(0, 10)
                    if (onSelectDay === atTime) {
                        var editId = localArr[i].id
                    }
                }
                this.setState({
                    title: '编辑',
                    checkFlag: 'edit',
                    logcont: editContent,
                    showDelete: true,
                    deleteId: editId
                })
            }
        }
        this.setState({
            show: true
        })
        localStorage.setItem('recordDay', onSelectDay)
        const da = localStorage.getItem('recordDay')
    }

    delete = (e) => {
        var deleteID = this.state.deleteId
        confirm({
            title: '确定要删除日志吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                destroy(`/worklog/${this.state.deleteId}`).then(res => {
                    this.setState({
                        show: false
                    })
                    this.getLogData()
                })
            },
            onCancel: () => {
                console.log('Cancel')
            }
        })
    }

    dateCellRender = (value) => {
        const cellDate = moment(value).format('YYYY-MM-DD')
        const localArr = this.state.note
        var time
        if (localArr !== '') {
            for (let i in localArr) {
                if (localArr[i].time !== '') {
                    time = localArr[i].time.substr(0, 10)
                }
                if (cellDate === time) {
                    return (
                        <div>
                            <Badge status="success" text={localArr[i].content} />
                        </div>
                    )
                }
            }
        }
    }
    render() {
        const { selectedValue, show, title, showTip, logcont, showDelete } = this.state
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        return (
            <Content style={{ margin: '0 16px' }}>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <Calendar
                        onSelect={this.onSelect}
                        dateCellRender={this.dateCellRender} />
                    <PopModal
                        show={show}
                        handleok={this.handleok}
                        onCancel={this.onCancel}
                        title={title}
                        showTip={showTip}
                        delete={this.delete}
                        showDelete={showDelete}
                        logcont={logcont} />
                </div>
            </Content>
        )
    }
}
export default checkwork
