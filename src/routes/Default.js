/**
 * 首页
 * @description
 * @author 舒丹彤
 * @date 2017/11/30
 */
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
    constructor(props) {
        super(props)
        this.state = {
            time: ''
        }
    }
    time() {
        var d = new Date()
        var str = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日' + '  ' + d.getHours() + ':' + d.getMinutes()
        this.setState({
            time: str
        })
    }
    componentDidMount() {
        this.timer = setInterval(() => this.time(), 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    testGetData = () => {
        axios.get('/api/user')
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        const CardMsg = (
            <div className="Card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="工作日志" bordered extra={<a href="/home/personalAffairs/dayLog">More</a>}>
                            <p>Card content</p>
                            <p>Card content</p>
                            <p>Card content</p>
                        </Card>
                    </Col>
                    <Col span={12}>
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
                    <div className="CardWrap">
                        {CardMsg}
                        <div className="time">
                            <p>{this.state.time}</p>
                        </div>
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
