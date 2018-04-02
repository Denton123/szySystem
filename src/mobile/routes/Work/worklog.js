import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, DatePicker, WhiteSpace, Card, Toast, Popover, Icon, Modal, TextareaItem } from 'antd-mobile'
import moment from 'moment'

import CustomForm from '../../components/CustomForm.js'

import {mIndex, mStore, mShow, mUpdate, mDestroy} from '../../../utils/ajax'
import {resetObject} from '../../../utils/utils'

// const alert = Modal.alert

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el
        }
        el = el.parentElement
    }
    return null
}

class Worklog extends React.Component {
    state = {
        date: null, // 选择的日期
        currentWorkLog: {}, // 当前的工作日志数据
        visible: false, // popover

        modalVisible: false, // modal
    }
    componentWillMount() {
        this.getWorklogData(new Date(Date.now()))
    }

    getWorklogData = (date) => {
        Toast.loading('加载中', 0)
        let params = {
            date: moment(date).format('YYYY-MM-DD'),
            user_id: this.props.user.id
        }
        mIndex('worklog', params)
            .then(res => {
                this.setState({
                    date,
                    currentWorkLog: resetObject(res.data.data[0])
                })
                Toast.hide()
            })
    }

    onDateChange = (date) => {
        this.getWorklogData(date)
    }

    onPopoverSelect = (node, index) => {
        let type = node.props.value
        this[type]()
        this.setState({
            visible: false,
        })
    }

    add = () => {
        this.setState({
            modalVisible: true,
        })
    }

    edit = () => {
        mShow(`/worklog/${this.state.currentWorkLog.id}`)
            .then(res => {
                console.log(res)
                this.setState({
                    currentWorkLog: res.data,
                    modalVisible: true,
                })
            })
    }

    destroy = () => {
        let confirm = window.confirm(`是否删除当前日志？`)
        if (confirm) {
            Toast.loading('删除中', 0)
            mDestroy(`/worklog/${this.state.currentWorkLog.id}`).then(res => {
                if (parseInt(res.data.id) === parseInt(this.state.currentWorkLog.id)) {
                    this.setState({
                        currentWorkLog: {}
                    })
                    Toast.info('删除成功', 1)
                } else {
                    Toast.info('删除失败', 1)
                }
            })
        }
        // alert('删除', '是否删除当前日志？', [
        //     {text: '取消', style: 'default'},
        //     {
        //         text: '确定',
        //         onPress: () => {
        //             Toast.loading('删除中', 0)
        //             mDestroy(`/worklog/${this.state.currentWorkLog.id}`).then(res => {
        //                 if (parseInt(res.data.id) === parseInt(this.state.currentWorkLog.id)) {
        //                     this.setState({
        //                         currentWorkLog: {}
        //                     })
        //                     Toast.info('删除成功', 1)
        //                 } else {
        //                     Toast.info('删除失败', 1)
        //                 }
        //             })
        //         }
        //     },
        // ])
    }

    // modal
    onModalSubmit = () => {
        this.formRef.onSubmit()
    }
    onModalClose = () => {
        this.setState({
            modalVisible: false
        })
    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return
        }
        const pNode = closest(e.target, '.am-modal-content')
        if (!pNode) {
            e.preventDefault()
        }
    }

    handleSubmit = (params) => {
        Toast.loading('保存中', 0)
        let data = {
            user_id: this.props.user.id,
            content: params.content,
            date: moment(this.state.date).format('YYYY-MM-DD')
        }
        if (Object.keys(this.state.currentWorkLog).length > 0) {
            mUpdate(`/worklog/${this.state.currentWorkLog.id}`, data)
                .then(res => {
                    if (parseInt(res.data.id) === parseInt(this.state.currentWorkLog.id)) {
                        this.onModalClose()
                        this.setState({
                            currentWorkLog: resetObject(res.data)
                        })
                        Toast.info('保存成功', 1)
                    } else {
                        Toast.info('保存失败', 1)
                    }
                })
        } else {
            mStore('worklog', data)
                .then(res => {
                    this.onModalClose()
                    this.setState({
                        currentWorkLog: resetObject(res.data)
                    })
                    Toast.info('保存成功', 1)
                })
        }
    }

    render() {
        const {
            date, // 日期
            currentWorkLog, // 当前工作日志
            visible, // 控制popover显示
            modalVisible, // 控制modal显示
        } = this.state
        const formFields = [
            ({getFieldProps, getFieldError}) => (
                <TextareaItem
                    {...getFieldProps('content', {
                        initialValue: currentWorkLog.content,
                        rules: [{required: true, message: '请输入工作日志'}]
                    })}
                    error={!!getFieldError('content')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('content').join('、'), 1)
                    }}
                    rows={5}
                    count={200}
                />
            ),
        ]
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
                <WhiteSpace size="lg" />
                {Object.keys(currentWorkLog).length > 0 ? (
                    <Card>
                        <Card.Header
                            title={this.props.user.realname}
                            thumb={<img width="22" height="22" src={this.props.user.avatar ? `/uploadImgs/${this.props.user.avatar}` : ''} />}
                            extra={<span>{currentWorkLog.date}</span>}
                        />
                        <Card.Body>
                            <div style={{minHeight: 150, textAlign: 'left'}}>
                                {currentWorkLog.content}
                            </div>
                            <Card.Footer extra={
                                <Popover mask
                                    visible={visible}
                                    overlay={[
                                        (<Popover.Item value="edit">修改</Popover.Item>),
                                        (<Popover.Item value="destroy">删除</Popover.Item>),
                                    ]}
                                    onSelect={this.onPopoverSelect}
                                >
                                    <Icon type="ellipsis" />
                                </Popover>
                            } />
                        </Card.Body>
                    </Card>
                ) : (
                    <Card>
                        <Card.Body>
                            没有当天工作日志
                        </Card.Body>
                        <Card.Footer extra={
                            <Popover mask
                                visible={visible}
                                overlay={[
                                    (<Popover.Item value="add">新增</Popover.Item>),
                                ]}
                                onSelect={this.onPopoverSelect}
                            >
                                <Icon type="ellipsis" />
                            </Popover>
                        } />
                    </Card>
                )}
                <Modal
                    visible={modalVisible}
                    transparent
                    maskClosable={false}
                    title={'工作日志'}
                    footer={[
                        {text: '取消', onPress: this.onModalClose},
                        {text: '提交', onPress: this.onModalSubmit}
                    ]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <CustomForm
                        wrappedComponentRef={(inst) => this.formRef = inst}
                        formFields={formFields}
                        hasFormOperation={false}
                        handleSubmit={this.handleSubmit}
                    />
                </Modal>
            </List>
        )
    }
}

export default Worklog
