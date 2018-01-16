/**
 * 登录页
 * @description
 * @author 苏智豪
 * @date 2017/11/23
 */
import React from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    message
} from 'antd'

import { isObject } from 'UTILS/utils.js'
import './Login.less'

const FormItem = Form.Item

class DefaultLoginForm extends React.Component {
    handleEnter = (e) => {
        if (e.keyCode === 13) {
            this.handleSubmit(e)
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                axios.post('/user/login', values)
                    .then(res => {
                        console.log(res)
                        if (isObject(res.data)) {
                            this.props.globalUpdateUser(res.data)
                            this.props.history.push('/home')
                        } else {
                            message.error(res.data)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Form onSubmit={this.handleSubmit} style={{width: '350px', margin: '0 auto'}}>
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入用户名'}]
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" size="large" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}]
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" onKeyDown={this.handleEnter} size="large" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true
                    })(
                        <Checkbox>记住我</Checkbox>
                    )}
                    <a className="pull-right" href="">忘记密码</a>
                    <Button type="primary" htmlType="submit" className="w100" size="large">
                        登录
                    </Button>
                </FormItem>
            </Form>
        )
    }
}

const LoginForm = Form.create()(DefaultLoginForm)

class Login extends React.Component {
    componentDidMount() {
        // 判断用户是否登录
        if (this.props.user !== null) {
            this.props.history.push('/home')
        }
    }
    render() {
        return (
            <div className="wrap">
                <div className="login">
                    <h1 className="title">生之园信息内部管理系统</h1>
                    <LoginForm {...this.props} />
                </div>
            </div>
        )
    }
}

export default Login
