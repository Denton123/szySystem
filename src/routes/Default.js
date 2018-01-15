/**
 * 首页
 * @description
 * @author 舒丹彤
 * @date 2017/11/30
 */
import styles from './default.less'
import React from 'react'
import moment from 'moment'
import { Layout, Breadcrumb, Icon, Card, Col, Row, Input, Avatar, List, Tooltip } from 'antd'
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
        this.timer = setInterval(() => this.getTime(), 1000)

    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    getTime = () => {
        var dt = new Date()
        var h = dt.getHours()
        var m = dt.getMinutes()
        var s = dt.getSeconds()
        var date = h + '时' + m + '分' + s + '秒'
        this.setState({
            time: moment().format('a')
        })
    }
    getData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            // show(`/worklog/${id}`).then(res => {
            //     this.setState({
            //         workLog: res.data
            //     })
            // })
            axios.get(`/worklog/default?page=1&user_id=${id}&pageSize=5`).then(res => {
                console.log('res --------- ')
                console.log(res)
                this.setState({
                    workLog: res.data.data
                })
            })
            show(`/summary?page=1&user_id=${id}&pageSize=4&page=1`).then(res => {
                this.setState({
                    summaryData: res.data.data
                })
            })
        }
    }

    render() {
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const user = this.props.user
        const {workLog, summaryData, time} = this.state
        const LogContent = ({content}) => (
            <p dangerouslySetInnerHTML={{__html: content}} />
            )
        const CardMsg = (
            <div className="Card">
                <Row gutter={16}>
                    <Col span={12}>
                        <Card
                            hoverable
                            title="工作日志"
                            bordered
                            extra={<Link to="/home/personal/work-log">更多</Link>}>
                            <List
                                className="animated fadeInRight"
                                itemLayout="horizontal"
                                dataSource={workLog}
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}
                                        actions={[<span className="defaultTime" href="javascript:void(0)">{moment(item.time).format('LL')}</span>]}>
                                        <Tooltip title={item.content} placement="topLeft">
                                            <List.Item.Meta
                                                description={<LogContent content={item.content} />} />
                                        </Tooltip>
                                    </List.Item>
                                    )}
                                />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            hoverable
                            title="个人总结"
                            bordered
                            extra={<Link to="/home/personal/summary">更多</Link>}>
                            <List
                                className="animated fadeInRight"
                                itemLayout="horizontal"
                                dataSource={summaryData}
                                sm="5"
                                xs="5"
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}
                                        actions={[<Link className="defaultTime" to={`/home/personal/summary/${item.id}`}>{moment(item.time).format('LL')}</Link>]}>
                                        <Tooltip title={<LogContent content={item.content} />} placement="topLeft">
                                            <List.Item.Meta
                                                description={<LogContent content={item.title} />} />
                                        </Tooltip>
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
                        <Avatar icon="user" src={user && user.avatar ? `/uploadImgs/${user.avatar}` : null} className="avatar" />
                        <div className="Greet">
                            <h2>{time}好，{user && user.realname}，祝你开心每一天！</h2>
                            <h4>{user && user.job}</h4>
                        </div>
                        <p className="Time tada animated">{moment().format('L a h:mm:ss')}</p>
                    </div>
                </Header>
                <div className="Main">
                    <div className="CardWrap">
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
