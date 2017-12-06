import React from 'react'
import { Form, Input } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

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
                task
            </div>
        )
    }
}

export default Task
