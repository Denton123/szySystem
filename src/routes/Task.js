import React from 'react'
import { Form, Input } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
const FormItem = Form.Item

class TestForm extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form
        // return (
        //     <Form layout="inline">
        //         <FormItem label="姓名">
        //             {getFieldDecorator('realname', {
        //                 rules: [{required: true, message: '请输入姓名'}]
        //             })(<Input />)}
        //         </FormItem>
        //         <FormItem label="邮箱">
        //             {getFieldDecorator('email', {
        //                 rules: [{
        //                     type: 'email', message: '邮箱格式不对'
        //                 }, {
        //                     required: true, message: '请输入邮箱'
        //                 }]
        //             })(<Input />)}
        //         </FormItem>
        //         <FormItem label="电话">
        //             {getFieldDecorator('phone', {
        //                 rules: [{
        //                     required: true, message: '请输入你的电话'
        //                 }]
        //             })(<Input />)}
        //         </FormItem>
        //     </Form>
        // )
        return (
            <Form layout="inline">
                {this.props.formFields.map((item, idx) => (
                    <FormItem key={idx} label={item.label}>
                        {getFieldDecorator(item.field, item.valid)(item.component)}
                    </FormItem>
                ))}
            </Form>
        )
    }
}

const CustomizedForm = Form.create({
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields)
    },
    mapPropsToFields(props) {
        let obj = {}
        for (let i in props.fields) {
            obj[i] = {
                ...props.fields[i],
                value: props.fields[i].value
            }
        }
        return obj
        // return {
        //     realname: {
        //         ...props.fields.realname,
        //         value: props.fields.realname.value,
        //     },
        //     email: {
        //         ...props.fields.email,
        //         value: props.fields.email.value,
        //     },
        //     phone: {
        //         ...props.fields.phone,
        //         value: props.fields.phone.value,
        //     },
        // }
    },
    onValuesChange(_, values) {
        console.log(values)
    },
})(TestForm)

class Task extends React.Component {
    state = {
        fields: {
            realname: {
                value: 'benjycui',
            },
            email: {
                value: null
            },
            phone: {
                value: null
            },
        },
    }
    handleFormChange = (changedFields) => {
        this.setState({
            fields: { ...this.state.fields, ...changedFields },
        })
    }
    render() {
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const fields = this.state.fields
        const formFields = [
            {
                label: '姓名',
                field: 'realname',
                valid: {
                    rules: [{required: true, message: '请输入姓名'}]
                },
                component: (<Input placeholder="姓名" />)
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
                component: (<Input placeholder="邮箱" />)
            },
            {
                label: '电话',
                field: 'phone',
                valid: {
                    rules: [{
                        required: true, message: '请输入你的电话'
                    }]
                },
                component: (<Input placeholder="电话" />)
            },
        ]
        return (
            <div>
                <CustomizedForm fields={fields} formFields={formFields} onChange={this.handleFormChange} />
                <pre>
                    {JSON.stringify(fields, null, 2)}
                </pre>
            </div>
        )
    }
}

export default Task
