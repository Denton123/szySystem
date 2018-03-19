/**
 * 登录页
 * @description
 * @author 苏智豪
 * @date 2017/11/23
 */
import React from 'react'
// import {
//     Form,
//     Icon,
//     Input,
//     Button,
//     Checkbox,
//     message
// } from 'antd'

import { ajax } from 'UTILS/ajax'
import { isObject } from 'UTILS/utils.js'
// import './Login.less'

class Login extends React.Component {
    componentDidMount() {
        // 判断用户是否登录
        if (this.props.user !== null) {
            this.props.history.push('/m/home')
        }
    }
    render() {
        return (
            <div className="wrap">
                login
            </div>
        )
    }
}

export default Login
