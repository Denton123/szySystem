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

// import './Setting.less'

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
    state = {
        confirmDirty: false
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmitForm(values)
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
            callback('两个密码输入不一致!')
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
                <FormItem label="密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            validator: this.checkConfirm
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem label="重复密码">
                    {getFieldDecorator('confirm', {
                        rules: [{
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
            password: {
                value: null
            },
            confirm: {
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
                // this.setState({
                //     formFieldsValues: {
                //         ...this.state.formFieldsValues,
                //         password: {
                //             value: null
                //         },
                //         confirm: {
                //             value: null
                //         }
                //     }
                // })
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
