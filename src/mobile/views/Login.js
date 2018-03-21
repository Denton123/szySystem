import React from 'react'
import { List, InputItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'

import { ajax } from 'UTILS/ajax'
import { isObject } from 'UTILS/utils.js'

class Login extends React.Component {
    state = {
        name: {
            value: null,
            hasError: false,
            errorMessage: '用户名不能为空',
        },
        password: {
            value: null,
            hasError: false,
            errorMessage: '密码不能为空',
        }
    }
    componentDidMount() {
        // 判断用户是否登录
        if (this.props.user !== null) {
            this.props.history.push('/home/default')
        }
    }
    handleSubmit = () => {
        let data = {}
        let error = []
        for (let i in this.state) {
            if (this.state[i].value === null) {
                this.setState(prevState => {
                    return {
                        [i]: {
                            ...prevState[i],
                            hasError: true
                        }
                    }
                })
                error.push(i)
            } else {
                data[i] = this.state[i].value
            }
        }
        if (error.length > 0) {
            let err = ''
            error.forEach((e, idx) => {
                if (idx !== 0) err += ','
                err += this.state[e].errorMessage
            })
            Toast.info(err, 1)
            return false
        } else {
            ajax('post', '/user/login', data)
                .then(res => {
                    if (isObject(res.data)) {
                        this.props.globalUpdateUser(res.data)
                        this.props.history.push('/home')
                    } else {
                        Toast.info(res.data, 1)
                    }
                })
        }
    }
    onErrorClick = (type) => {
        if (this.state[type].hasError) {
            Toast.info(this.state[type].errorMessage, 1)
        }
    }
    onChange = (value, type) => {
        if (value && value.length > 0) {
            this.setState(prevState => {
                return {
                    [type]: {
                        ...prevState[type],
                        hasError: false
                    }
                }
            })
        }
        this.setState(prevState => {
            return {
                [type]: {
                    ...prevState[type],
                    value: value
                }
            }
        })
    }
    render() {
        const {
            name,
            password,
        } = this.state
        return (
            <List renderHeader={() => (<p className="txt-c">内部管理系统</p>)}>
                <InputItem
                    name="name"
                    value={name.value}
                    error={name.hasError}
                    onErrorClick={() => this.onErrorClick('name')}
                    onChange={(val) => this.onChange(val, 'name')}
                    placeholder="请输入用户名"
                    clear
                    autoComplete="off"
                >标题</InputItem>
                <InputItem
                    name="password"
                    value={password.value}
                    error={password.hasError}
                    onErrorClick={() => this.onErrorClick('password')}
                    onChange={(val) => this.onChange(val, 'password')}
                    type="password"
                    placeholder="请输入密码"
                    clear
                >密码</InputItem>
                <List.Item>
                    <div
                        style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
                        onClick={this.handleSubmit}
                    >
                        登录
                    </div>
                </List.Item>
            </List>
        )
    }
}

export default Login
