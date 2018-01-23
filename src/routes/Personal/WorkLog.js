/**
 * 每日日志
 */
import React, {Component} from 'react'
import { Layout, Button, Calendar, Badge, message, Modal } from 'antd'
import PopModal from 'COMPONENTS/modal/LogModal.js'
import 'ROUTES/Personal/WorkLog.less'
import {valueToMoment, momentToValue, formatDate, resetObject, getTime} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
const { Content } = Layout
const confirm = Modal.confirm
class WorkLog extends Component {
    state = {
        note: [], // 记录当前用户全部工作日志
        show: false, // 是否显示对话框
        title: '', // 对话框标题
        showTip: false, // 显示提示
        logcont: '', // 对话框内容
        showDelete: false, // 是否显示对话框中的删除
        worklogId: 0, // 当前的工作日志id
        worklogDate: '', // 当前的工作日志的日期
        date: this.props.location.state && this.props.location.state.date ? this.props.location.state.date : valueToMoment(formatDate()),
        mode: this.props.location.state && this.props.location.state.mode ? this.props.location.state.mode : 'month'
    }

    componentDidMount() {
        this.getLogData()
        console.log(this.props.location)
        this.props.BLhandleLinkClick('/personal', '/personal/work-log')
        // this.props.history.replace(this.props.location.pathname, {
        //     date: key
        // })
    }

    getLogData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            index('/worklog', {user_id: this.props.user.id})
            .then(res => {
                let arr = []
                res.data.forEach(d => {
                    arr.push(resetObject(d))
                })
                this.setState({
                    note: arr
                })
            })
        }
    }

    handleok = (content) => {
        if (content === '') {
            this.setState({
                showTip: true
            })
        } else {
            let data = {
                user_id: this.props.user.id,
                content: content,
                date: this.state.worklogDate
            }
            if (this.state.worklogId) { // 编辑
                update(`/worklog/${this.state.worklogId}`, data)
                .then(res => {
                    if (parseInt(res.data.id) === parseInt(this.state.worklogId)) {
                        message.success('编辑日志成功')
                        this.setState({
                            show: false
                        })
                        let arr = []
                        this.state.note.forEach(n => {
                            if (n.id === res.data.id) {
                                arr.push(res.data)
                            } else {
                                arr.push(n)
                            }
                        })
                        this.setState({
                            note: arr
                        })
                    } else {
                        message.error('编辑日志失败')
                    }
                })
            } else { // 新增
                store('/worklog', data).then(res => {
                    if (res.status === 200) {
                        message.success('新增日志成功')
                        this.getLogData()
                        this.setState({
                            show: false
                        })
                    } else {
                        message.error('新增日志失败')
                    }
                })
            }
        }
    }

    onCancel = (e) => {
        this.setState({
            show: false,
            showTip: false,
            worklogId: null
        })
    }

    onSelect = (moment) => {
        if (this.state.mode !== 'month') {
            return false
        }
        const currentDate = momentToValue(moment)
        console.log(moment)
        const currentLog = this.state.note.find(n => n.date === currentDate) // 获取当前用户当天的日志
        if (currentLog) { // 存在时编辑
            show(`/worklog/${currentLog.id}`)
            .then(res => {
                if (Object.keys(res.data).length > 0) {
                    this.setState({
                        title: '编辑',
                        logcont: res.data.content,
                        showDelete: true,
                        worklogId: res.data.id,
                        worklogDate: currentDate,
                        show: true,
                    })
                } else {
                    message.error('该日志不存在，请刷新页面')
                }
            })
        } else { // 新增
            this.setState({
                title: '新增',
                logcont: '',
                showDelete: false,
                worklogId: null,
                worklogDate: currentDate,
                show: true,
            })
        }
        this.props.history.replace(this.props.location.pathname, {
            date: momentToValue(moment),
            mode: this.state.mode
        })
    }

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
    handDelete = (e) => {
        let worklogId = this.state.worklogId
        confirm({
            title: '确定要删除日志吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                destroy(`/worklog/${worklogId}`).then(res => {
                    if (parseInt(res.data.id) === parseInt(worklogId)) {
                        this.setState({
                            show: false
                        })
                        this.getLogData()
                        message.success('删除成功')
                    } else {
                        message.error('删除失败')
                    }
                })
            },
            onCancel: () => {
                console.log('Cancel')
            }
        })
    }
    dateCellRender = (moment) => {
        const cellDate = momentToValue(moment)
        const currentLog = this.state.note.find(n => n.date === cellDate) // 当前日期的工作日志
        if (currentLog) {
            return (
                <Badge status="success" text={currentLog.content} />
            )
        }
    }
    /**
     * [不可选择日期]
     * @Author   szh
     * @DateTime 2018-01-11
     */
    disabledDate = (moment) => {
        return getTime() < getTime(moment)
    }
    render() {
        const { selectedValue, show, title, showTip, logcont, showDelete } = this.state
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
                        onSelect={this.onSelect}
                        disabledDate={this.disabledDate}
                        dateCellRender={this.dateCellRender}
                        defaultValue={valueToMoment(this.state.date)}
                        onPanelChange={this.onPanelChange}
                        mode={this.state.mode} />
                    <PopModal
                        show={show}
                        handleok={this.handleok}
                        onCancel={this.onCancel}
                        title={title}
                        showTip={showTip}
                        handDelete={this.handDelete}
                        showDelete={showDelete}
                        logcont={logcont}
                        user={this.props.user} />
                </div>
            </Content>
        )
    }
}
export default WorkLog
