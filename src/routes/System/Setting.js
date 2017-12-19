import React, {Component} from 'react'
import {
    Icon,
    Button,
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Checkbox,
    AutoComplete,
    Radio,
    DatePicker,
    Upload,
    message,
    Avatar
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
import {checkPhone} from 'UTILS/regExp'
import {ajax, show} from 'UTILS/ajax'
import {getBase64} from 'UTILS/utils'

const RadioGroup = Radio.Group
const FormItem = Form.Item

class SetForm extends React.Component {
    state = {
        confirmDirty: false,
        formFieldsValues: {
            id: {
                value: null
            },
            skin: {
                value: null
            },
            fontsize: {
                value: null
            },
            password: {
                value: null
            },
            confirm: {
                value: null
            }
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
            }
        })
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value
        this.setState({ confirmDirty: this.state.confirmDirty || !!value })
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!')
        } else {
            callback()
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true })
        }
        callback()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="皮肤">
                    {getFieldDecorator('skin')(
                        <RadioGroup>
                            <Radio value="blue">清新时尚蓝</Radio>
                            <Radio value="green">环保绽放绿</Radio>
                            <Radio value="purple">高贵丁香紫</Radio>
                            <Radio value="yellow">狂热活泼黄</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="字体">
                    {getFieldDecorator('fontsize')(
                        <RadioGroup>
                            <Radio value="small">小号</Radio>
                            <Radio value="middle">中号</Radio>
                            <Radio value="big">大号</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入你的密码!'
                        }, {
                            validator: this.checkConfirm
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem label="重复密码">
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: '请确认你的密码!'
                        }, {
                            validator: this.checkPassword
                        }],
                    })(
                        <Input type="password" placeholder="密码" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedSetForm = Form.create()(SetForm)

class Setting extends Component {
    componentDidMount() {
        // this.getData()
    }

    getData = () => {
        if (!this.props.user) {
            this.props.history.push('/login')
        }
        let uid = this.props.user.id
        show(`user/${uid}`)
            .then(res => {
                // 直接更新内部表单数据
                this.props.updateEditFormFieldsValues(res.data)
            })
            .catch(err => {
                console.log(err)
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
                <WrappedSetForm />
            </div>
        )
    }
}

export default Setting
