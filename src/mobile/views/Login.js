import React from 'react'
import { Flex, List, InputItem, WhiteSpace } from 'antd-mobile'
import { createForm } from 'rc-form'

import { ajax } from 'UTILS/ajax'
import { isObject } from 'UTILS/utils.js'

class loginForm extends React.Component {
    componentDidMount() {
    }
    render() {
        const { getFieldProps } = this.props.form
        return (
            <List style={{transform: 'translateY(-50%)'}} renderHeader={() => (<h2 className="txt-c">内部管理系统</h2>)}>
                <InputItem
                    {...getFieldProps('name')}
                    clear
                    placeholder="请输入用户名"
                >标题</InputItem>
                <InputItem
                    {...getFieldProps('password')}
                    type="password"
                    placeholder="请输入密码"
                >密码</InputItem>
                <List.Item>
                    <div
                        style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
                        onClick={this.handleClick}
                    >
                        click to focus
                    </div>
                </List.Item>
            </List>
        )
    }
}

const TheLoginForm = createForm()(loginForm)

class Login extends React.Component {
    componentDidMount() {
        // 判断用户是否登录
        if (this.props.user !== null) {
            this.props.history.push('/m/home')
        }
    }
    render() {
        return (
            <Flex className="w100 h100" justify="center" align="center">
                <TheLoginForm />
            </Flex>
        )
    }
}

export default Login
