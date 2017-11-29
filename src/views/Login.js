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
                            this.props.updateUser(res.data)
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
            <Form onSubmit={this.handleSubmit} style={{width: '300px'}}>
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入用户名'}]
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入密码'}]
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" onKeyDown={this.handleEnter} />
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
                    <Button type="primary" htmlType="submit" className="w100">
                        Log in
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
            <div style={styles.login}>
                <h2>生之园信息内部管理系统</h2>
                <LoginForm {...this.props} />
            </div>
        )
    }
}

const styles = {}

styles.login = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #d9d9d9',
    borderRadius: '5px',
    padding: '20px'
}

export default Login
