import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import { Card, List, WhiteSpace, Button } from 'antd-mobile'

// const alert = Modal.alert

class My extends React.Component {
    componentWillMount() {
        this.props.setCustomNavBarState(this.props.route.name, 'menu')
    }
    logout = () => {
        axios.get('/user/logout')
        .then(res => {
            this.props.globalUpdateUser(null)
            this.props.history.push('/login')
        })
    }
    alertLogout = () => {
        let logout = window.confirm('是否退出当前账号？')
        if (logout) {
            this.logout()
        }
        // alert('退出', '是否退出当前账号？', [
        //     {text: '取消', style: 'default'},
        //     {text: '确定', onPress: this.logout},
        // ])
    }
    render() {
        const {
            route,
            match,
            user,
        } = this.props
        return (
            <div>
                <Card full>
                    <Card.Header
                        title={user && user.realname}
                        thumb={<img style={{width: 22, height: 22}} src={user && user.avatar ? `/uploadImgs/${user.avatar}` : '/default_avatar.png'} />}
                        extra={<span>{user && user.job}</span>}
                    />
                    <Card.Body>
                        <List>
                            <List.Item extra={user && user.name}>用户名</List.Item>
                            <List.Item extra={user && user.gender === 'male' ? '男' : '女'}>性别</List.Item>
                            <List.Item extra={user && user.phone}>电话</List.Item>
                            <List.Item extra={user && user.email}>邮件</List.Item>
                            <List.Item extra={user && user.entry_date}>入职日期</List.Item>
                        </List>
                    </Card.Body>
                </Card>
                <WhiteSpace />
                <List>
                    <List.Item
                        arrow="horizontal"
                        onClick={() => {
                            this.props.history.push(`${match.path}/userinfo`)
                        }}
                    >
                        编辑个人信息
                    </List.Item>
                </List>
                <WhiteSpace />
                <Button onClick={this.alertLogout}>退出登录</Button>
            </div>
        )
    }
}

export default My
