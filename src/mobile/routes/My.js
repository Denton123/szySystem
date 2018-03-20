import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import { Card, List, WhiteSpace } from 'antd-mobile'

class My extends React.Component {
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
                        title={user.realname}
                        thumb={user.avatar ? `/uploadImgs/${user.avatar}` : '/default_avatar.png'}
                        extra={<span>{user.job}</span>}
                    />
                    <Card.Body>
                        <List>
                            <List.Item extra={user.name}>用户名</List.Item>
                            <List.Item extra={user.gender === 'male' ? '男' : '女'}>性别</List.Item>
                            <List.Item extra={user.phone}>电话</List.Item>
                            <List.Item extra={user.email}>邮件</List.Item>
                            <List.Item extra={user.entry_date}>入职日期</List.Item>
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
            </div>
        )
    }
}

export default My
