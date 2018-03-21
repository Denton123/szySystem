import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import { Card, List, WhiteSpace, Button } from 'antd-mobile'

class My extends React.Component {
    logout = () => {
        axios.get('/user/logout')
        .then(res => {
            this.props.globalUpdateUser(null)
            this.props.history.push('/login')
        })
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
                <Button onClick={this.logout}>退出登录</Button>
            </div>
        )
    }
}

export default My
