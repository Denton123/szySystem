import styles from './default.less'
import React from 'react'
import { Layout, Breadcrumb, Icon, Card, Col, Row, List } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

const { Content, Header } = Layout

class Default extends React.Component {
    render() {
        console.log(this.props)
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const CardMsg = (
            <div className="Card">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="工作日志" bordered extra={<a href="/home/personalAffairs/dayLog">More</a>}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="个人总结" bordered extra={<a href="/home/personalAffairs/weekSummary">More</a>}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                </Row>
            </div>
            )

        const NoticeMsg = (
            <div className="NoticeMsg">
                <Card title="最新通知">
                    <p>Card content</p>
                    <p>Card content</p>
                    <p>Card content</p>
                </Card>
            </div>
            )

        return (
            <Content className="Content">
                <Header className="IndexHeader">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="HeaderMsg">
                        <span className="avatar">
                            <img src="https://gw.alipayobjects.com/zos/rmsportal/dRFVcIqZOYPcSNrlJsqQ.png" />
                        </span>
                        <div className="Greet">
                            <h2>下午好，马云，祝你开心每一天！</h2>
                            <h4>技术部 - 总监</h4>
                        </div>
                    </div>
                </Header>
                <div className="Main">
                    <div>
                        {CardMsg}
                    </div>
                    <div>
                        {NoticeMsg}
                    </div>
                </div>
            </Content>
        )
    }
}

export default Default
