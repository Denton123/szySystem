import React, {Component} from 'react'
import {
    Button,
    Form,
    Input,
    Row,
    Col,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import CustomForm from 'COMPONENTS/form/CustomForm'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'
// 引入工具方法
import {show, update, ajax} from 'UTILS/ajax'
import {getBase64} from 'UTILS/utils'

const FormItem = Form.Item

class SetForm extends React.Component {
    state = {
        confirmDirty: false
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            console.log('err')
            console.log(err)
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmitForm(values, this.props.form)
            }
        })
    }
    // checkOldPassword = (rule, value, callback) => {
        // const form = this.props.form
        // if (
        //     (form.getFieldValue('password') && form.getFieldValue('password').length > 0) ||
        //     (form.getFieldValue('confirm') && form.getFieldValue('confirm').length > 0)
        //     ) {
        //     if (value && value.length > 0) {
        //         callback()
        //     } else {
        //         callback('请输入原密码')
        //     }
        // } else {
        //     callback()
        // }
    // }
    // checkPassword = (rule, value, callback) => {
        // const form = this.props.form
        // if (
        //     (value && value.length > 0) ||
        //     (form.getFieldValue('oldpassword') && form.getFieldValue('oldpassword').length > 0) ||
        //     (form.getFieldValue('password') && form.getFieldValue('password').length > 0)
        //     ) {
        //     if (value !== form.getFieldValue('password')) {
        //         callback('两个密码输入不一致!')
        //     } else {
        //         callback()
        //     }
        // } else {
        //     callback()
        // }
    // }
    // checkConfirm = (rule, value, callback) => {
        // const form = this.props.form
        // if (
        //     (value && value.length > 0) ||
        //     (form.getFieldValue('oldpassword') && form.getFieldValue('oldpassword').length > 0) ||
        //     (form.getFieldValue('confirm') && form.getFieldValue('confirm').length > 0)
        //     ) {
        //     if (!/^.*(?=.{9,})(?=.*\d)(?=.*[a-z]).*$/.test(value)) {
        //         callback('密码不能小于9位，必须包含字母和数字')
        //     } else {
        //         form.validateFields(['oldpassword', 'confirm'], {force: true})
        //         callback()
        //     }
        // } else {
        //     callback()
        // }
    // }

    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }

    // 重复密码触发的
    checkPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('两个密码输入不一致!')
        } else {
            callback()
        }
    }

    // 新密码触发的
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form
        if (value) {
            if (!/^.*(?=.{9,})(?=.*\d)(?=.*[a-z]).*$/.test(value)) {
                callback('密码不能小于9位，必须包含字母和数字')
            }
            if (this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true })
            }
        }
        callback()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="原密码">
                    {getFieldDecorator('oldpassword', {
                        rules: [{
                            required: true, message: '请输入原密码!',
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem label="新密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入新密码!',
                        }, {
                            validator: this.checkConfirm
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem label="重复新密码">
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请重复新密码!',
                        }, {
                            validator: this.checkPassword
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedSetForm = Form.create({})(SetForm)

class Setting extends Component {
    // 提交表格到后台
    handleSubmitForm = (values, form) => {
        console.log('handleSubmitForm ----- ')
        console.log(values)
        let uid = this.props.user.id
        let data = {}
        for (let i in values) {
            data[i] = values[i]
        }
        data['id'] = uid
        ajax('post', `/user/reset-password`, data, false)
            .then(res => {
                console.log(res)
                if (res.data === true) {
                    message.success('保存成功！')
                } else {
                    console.log(res.data)
                    message.error(res.data)
                }
                form.setFieldsValue({'oldpassword': '', 'password': '', 'confirm': ''})
            })
            .catch(err => {
                console.log(err)
                message.error('保存失败！')
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
        const state = this.state

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Row>
                    <Col span={8}><WrappedSetForm handleSubmitForm={this.handleSubmitForm} /></Col>
                </Row>
            </div>
        )
    }
}

export default Setting
