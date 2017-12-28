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

import '../Setting.less'

import CustomForm from 'COMPONENTS/form/CustomForm'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'
// 引入工具方法
import {show, update} from 'UTILS/ajax'
import {getBase64} from 'UTILS/utils'

const RadioGroup = Radio.Group
const FormItem = Form.Item

function transformValue(field, value) {
    if (value === null || value === undefined) return null
    let v
    if (field.indexOf('date') > -1) {
        // 日期组件的value必须使用moment
        v = valueToMoment(value)
    } else {
        v = value
    }
    return v
}

class SetForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmitForm(values)
            }
        })
    }
    checkOldPassword = (rule, value, callback) => {
        const form = this.props.form
        if (
            (form.getFieldValue('password') && form.getFieldValue('password').length > 0) ||
            (form.getFieldValue('confirm') && form.getFieldValue('confirm').length > 0)
            ) {
            if (value && value.length > 0) {
                callback()
            } else {
                callback('请输入原密码')
            }
        } else {
            callback()
        }
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form
        if (
            (value && value.length > 0) ||
            (form.getFieldValue('oldpassword') && form.getFieldValue('oldpassword').length > 0) ||
            (form.getFieldValue('password') && form.getFieldValue('password').length > 0)
            ) {
            if (value !== form.getFieldValue('password')) {
                callback('两个密码输入不一致!')
            } else {
                callback()
            }
        } else {
            callback()
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form
        if (
            (value && value.length > 0) ||
            (form.getFieldValue('oldpassword') && form.getFieldValue('oldpassword').length > 0) ||
            (form.getFieldValue('confirm') && form.getFieldValue('confirm').length > 0)
            ) {
            if (!/^.*(?=.{9,})(?=.*\d)(?=.*[a-z]).*$/.test(value)) {
                callback('密码不能小于9位，必须包含字母和数字')
            } else {
                form.validateFields(['oldpassword', 'confirm'], {force: true})
                callback()
            }
        } else {
            callback()
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="皮肤">
                    {getFieldDecorator('skin')(
                        <RadioGroup onChange={this.props.onChange}>
                            <Radio value="blue">
                                清新时尚蓝
                                <span className="RadioBlock" style={{background: '#1890ff'}} />
                            </Radio>
                            <Radio value="green">
                                环保绽放绿
                                <span className="RadioBlock" style={{background: '#0aa679'}} />
                            </Radio>
                            <Radio value="purple">
                                高贵丁香紫
                                <span className="RadioBlock" style={{background: '#7546c9'}} />
                            </Radio>
                            <Radio value="yellow">
                                狂热活泼黄
                                <span className="RadioBlock" style={{background: '#fbd437'}} />
                            </Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem label="字体">
                    {getFieldDecorator('font_size')(
                        <RadioGroup>
                            <Radio value="small">
                                小号
                                <Button style={{fontSize: 12, 'marginLeft': 6}} disabled size="small">生之园</Button>
                            </Radio>
                            <Radio value="middle">
                                中号
                                <Button style={{fontSize: 14, 'marginLeft': 6}} disabled size="small">生之园</Button>
                            </Radio>
                            <Radio value="big">
                                大号
                                <Button style={{fontSize: 16, 'marginLeft': 6}} disabled size="small">生之园</Button>
                            </Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit">保存</Button>
                </FormItem>
            </Form>
        )
    }
}

const WrappedSetForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.updateFormFields(changedFields)
    },
    mapPropsToFields(props) {
        let obj = {}
        for (let i in props.formFieldsValues) {
            obj[i] = Form.createFormField({
                ...props.formFieldsValues[i],
                value: props.formFieldsValues[i].value
            })
        }
        return obj
    }
})(SetForm)

class Setting extends Component {
    state = {
        formFieldsValues: {
            skin: {
                value: null
            },
            font_size: {
                value: null
            }
        }
    }
    componentDidMount() {
        this.getData()
    }

    getData = () => {
        if (!this.props.user) {
            this.props.history.push('/login')
        }
        let uid = this.props.user.id
        show(`user/${uid}`)
            .then(res => {
                console.log(res)
                // 直接更新内部表单数据
                this.updateEditFormFieldsValues(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    onChange = (e) => {
        console.log(e.target.value)
        const value = e.target.value
    }
    // 编辑数据时更新表单数据
    updateEditFormFieldsValues = (data) => {
        this.setState((prevState, props) => {
            let obj = {}
            Object.keys(prevState.formFieldsValues).forEach(field => {
                obj[field] = {
                    value: transformValue(field, data[field])
                }
            })
            return {
                formFieldsValues: obj
            }
        })
    }

    updateFormFields = (changedFields) => {
        this.setState({
            formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
        })
    }

    // 提交表格到后台
    handleSubmitForm = (values) => {
        console.log('handleSubmitForm ----- ')
        console.log(values)
        let uid = this.props.user.id
        update(`user/${uid}`, values, false)
            .then(res => {
                // 直接更新内部表单数据
                // this.props.updateEditFormFieldsValues(res.data)
                console.log(res)
                message.success('保存成功！')
                this.props.globalUpdateUser(res.data)
                this.setState({
                    formFieldsValues: {
                        ...this.state.formFieldsValues,
                        oldpassword: {
                            value: null
                        },
                        password: {
                            value: null
                        },
                        confirm: {
                            value: null
                        }
                    }
                })
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

        const props = {
            formFieldsValues: this.state.formFieldsValues,
            updateFormFields: this.updateFormFields,
            handleSubmitForm: this.handleSubmitForm,
            onChange: this.onChange
        }

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <WrappedSetForm {...props} />
            </div>
        )
    }
}

export default Setting
