import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Row, Col, Form, Input, Tooltip, Cascader, Select, Checkbox, AutoComplete, Radio, DatePicker, Upload } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
import moment from 'moment'

// 引入操作按钮组件
import BasicOperation from 'COMPONENTS/basic/BasicOperation'
import CustomForm from 'COMPONENTS/form/CustomForm'

// 引入头像上传组件
import AvatarUpload from 'COMPONENTS/input/AvatarUpload/AvatarUpload'

// 引入工具方法
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

const { Content } = Layout
const FormItem = Form.Item
const Option = Select.Option
const AutoCompleteOption = AutoComplete.Option
const RadioGroup = Radio.Group

class Info extends Component {
    state = {
        // 表单
        formFieldsValues: {
            avatar: {
                value: null
            },
            id: {
                value: null
            },
            name: {
                value: null
            },
            realname: {
                value: 'tests'
            },
            gender: {
                value: null
            },
            email: {
                value: null
            },
            phone: {
                value: null
            },
            birth_date: {
                value: null
            },
            job: {
                value: null
            },
            entry_date: {
                value: null
            }
        },

        // 编辑状态（true/不可编辑，false/可编辑）
        formDisabled: true,

        imageUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=938116244,3259922549&fm=27&gp=0.jpg'
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        // 获取用户信息,用户id（登录功能还没做完成，所以还不能获取用户信息）
        var id = 1
        index(`user/${id}`)
            .then(res => {
                console.log('getData fn--- ')
                let data = res.data
                let obj = {}
                for (let i in this.state.formFieldsValues) {
                    obj[i] = {
                        value: i.indexOf('date') === -1 ? data[i] : moment(data.birth_date, 'YYYY-MM-DD')
                    }
                }
                this.setState({
                    formFieldsValues: obj
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleFormSubmit = (values) => {
        console.log('----------------------------')
        console.log('parent `s :', values)
        // 改为可编辑状态
        this.setState({
            formDisabled: !this.state.formDisabled
        }, () => {
            // 如果是保存状态 提交表单更新数据
            if (this.state.formDisabled) {
                update(`user/1`, values, true)
                    .then(res => {
                        console.log('handleFormSubmit fn--- ')
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    }

    updateFormFields = (changedFields) => {
        console.log(changedFields)
        this.setState({
            formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
        })
    }

    normFile = (e) => {
        console.log('Upload event:', e)
        if (Array.isArray(e)) {
            return e
        }
        return e && e.fileList
    }

    csfn = () => {
        console.log('this.state.formDisabled: ' + this.state.formDisabled)
    }

    render() {
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const state = this.state

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        }

        const operationBtn = [
            () => <Button type="primary" onClick={this.csfn}>编辑</Button>
        ]

         // 表单
        const formFields = [
            {
                component: (<Button type="primary" htmlType="submit">{state.formDisabled ? '编辑' : '保存'}</Button>)
            },
            {
                label: '头像',
                field: 'avatar',
                valid: {
                    rules: [{required: true, message: '请输入头像'}],
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile
                },
                component: (
                    <AvatarUpload disabled={state.formDisabled} />
                ),
                value: null
            },
            {
                label: '用户名',
                field: 'name',
                valid: {
                    rules: [{required: true, message: '请输入用户名'}]
                },
                component: (<Input disabled prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />),
                value: null
            },
            {
                label: '真实姓名',
                field: 'realname',
                valid: {
                    rules: [{required: true, message: '请输入真实姓名'}]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="真实姓名" />),
                value: null
            },
            {
                label: '性别',
                field: 'gender',
                valid: {
                    rules: [{required: true, message: '请选择性别'}]
                },
                component: (
                    <RadioGroup>
                        <Radio disabled={state.formDisabled} value="male">男</Radio>
                        <Radio disabled={state.formDisabled} value="female">女</Radio>
                    </RadioGroup>
                )
            },
            {
                label: '邮箱',
                field: 'email',
                valid: {
                    rules: [{
                        type: 'email', message: '邮箱格式不对'
                    }, {
                        required: true, message: '请输入邮箱'
                    }]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="邮箱" />)
            },
            {
                label: '电话',
                field: 'phone',
                valid: {
                    rules: [{ required: true, message: '请输入你的电话' }]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="电话" />)
            },
            {
                label: '出生日期',
                field: 'birth_date',
                valid: {
                    rules: [{required: true, message: '请选择出生日期'}]
                },
                component: <DatePicker disabled={state.formDisabled} />
            },
            {
                label: '职位',
                field: 'job',
                valid: {
                    rules: [{required: true, message: '请输入职位'}]
                },
                component: (<Input disabled={state.formDisabled} placeholder="职位" />)
            },
            {
                label: '入职日期',
                field: 'entry_date',
                valid: {
                    rules: [{required: true, message: '请选择入职日期'}]
                },
                component: <DatePicker disabled={state.formDisabled} />
            }
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Row>
                    <Col span={6} offset={18}>
                        <BasicOperation operationBtns={operationBtn} />
                    </Col>
                </Row>
                <CustomForm
                    formFields={formFields}
                    handleSubmit={this.handleFormSubmit}
                    updateFormFields={this.updateFormFields}
                    formFieldsValues={state.formFieldsValues}
                    customFormItemLayout={formItemLayout}
                />

            </div>
        )
    }
}
export default Info
