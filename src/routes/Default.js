/**
 * 首页
 * @description
 * @author 舒丹彤
 * @date 2017/11/30
 */
import styles from './default.less'
import React from 'react'
import moment from 'moment'
import { Layout, Breadcrumb, Icon, Card, Col, Row, Input, Avatar, List } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

const { Content, Header } = Layout

class Default extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: '',
            value: '',
            workLog: [],
            summaryData: []
        }
    }
    componentDidMount() {
        this.getData()
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
    getData = () => {
        const id = this.props.user.id
        show(`/worklog/${id}`).then(res => {
            this.setState({
                workLog: res.data
            })
            console.log(this.state.workLog)
        })
        show(`/summary/?page=1&user_id=${id}`).then(res => {
            console.log(res)
            this.setState({
                summaryData: res.data.data
            })
        })
    }

    render() {
        console.log(this.state.workLog)
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const user = this.props.user
        const {workLog, summaryData} = this.state
        const LogContent = ({content}) => (
            <p className="LogContent" dangerouslySetInnerHTML={{__html: content}} />
            )
        const CardMsg = (
            <div className="Card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title="工作日志"
                            bordered
                            extra={<a href="/home/personal/work-log">更多</a>}>
                            <List
                                itemLayout="horizontal"
                                dataSource={workLog}
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}>
                                        <List.Item.Meta
                                            title={<LogContent content={item.content} />} />
                                        <div>{moment(item.date).format('LL')}</div>
                                    </List.Item>
                                    )}
                                />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title="个人总结"
                            bordered
                            extra={<a href="/home/personal/summary">更多</a>}>
                            <List
                                itemLayout="horizontal"
                                dataSource={summaryData}
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}>
                                        <List.Item.Meta
                                            title={<LogContent content={item.content} />} />
                                        <div>{moment(item.time).format('LL')}</div>
                                    </List.Item>
                                    )}
                                />
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
                            <Avatar icon="user" src={user && user.avatar ? `/uploadImgs/${user.avatar}` : null} style={{fontSize: 41}} />
                        </span>
                        <div className="Greet">
                            <h2>下午好，{user && user.realname}，祝你开心每一天！</h2>
                            <h4>技术部 - 总监</h4>
                        </div>
                    </div>
                </Header>
                <div className="Main">
                    <div className="CardWrap">
                        {CardMsg}
                        <div className="time">
                            <p>{moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
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
