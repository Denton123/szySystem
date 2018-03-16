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
} from 'react-router-dom'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import {ntfcTitle, ntfcUrl, ntfcDesc} from 'UTILS/notification'

const { Content, Header } = Layout

class Default extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: '',
            value: '',
            workLog: [],
            summaryData: [],
            currentNotificationPageSize: 6,
            currentNotificationPage: 1,
            currentNotificationData: [],
            allUser: [], // 全部用户
            // 最高权限才能查看 ----------
            highestData: [],
            highestDataPagination: {
                onChange: (page) => {
                    this.getHighestData(page)
                },
            },
        }
    }
    componentDidMount() {
        this.props.BLhandleLinkClick('/default', '/default')
        this.getData()
        this.timer = setInterval(() => this.getTime(), 1000)
        this.setCurrentNotificationData(1)
        if (this.props.user.highest) { // 只有最高权限才能查看
            this.getAllUser()
            this.getHighestData()
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    /**
     * [setCurrentNotificationData 设置首页通知数据]
     * @Author   szh
     * @DateTime 2018-01-23
     * @param    {Number}   page [页数]
     */
    setCurrentNotificationData = (page) => {
        let pagesize = this.state.currentNotificationPageSize
        let arr = []
        this.props.notificationData.forEach((d, i) => {
            if (i < (page * pagesize) && i >= ((page - 1) * pagesize)) {
                arr.push(d)
            }
        })
        this.setState({
            currentNotificationData: arr
        })
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
                this.setState({
                    workLog: res.data.data
                })
            })
            show(`/summary?page=1&user_id=${id}&pageSize=5&page=1`).then(res => {
                this.setState({
                    summaryData: res.data.data
                })
            })
        }
    }
    getHighestData = (page = 1) => {
        index(`notification`, { page: page })
            .then(res => {
                let notification = res.data.data
                notification.forEach(n => {
                    n['data'] = JSON.parse(n['data'])
                    n['desc'] = ntfcDesc(n)
                })
                let pagination = {}
                for (let i in res.data) {
                    if (i === 'data') continue
                    if (i === 'currentPage') {
                        pagination['current'] = res.data[i]
                        continue
                    }
                    pagination[i] = res.data[i]
                }
                this.setState(prveState => {
                    return {
                        highestData: notification,
                        highestDataPagination: {
                            ...prveState.highestDataPagination,
                            ...pagination
                        }
                    }
                })
            })
    }
    getAllUser = () => {
        ajax('get', '/user/all')
            .then(res => {
                this.setState({
                    allUser: res.data
                })
            })
    }

    linkClick = (openKeys, selectedKeys) => {
        return () => {
            this.props.BLhandleLinkClick(openKeys, selectedKeys)
        }
    }

    render() {
        const user = this.props.user
        const {
            workLog,
            summaryData,
            time,
            // 最近通知设置
            currentNotificationPageSize,
            currentNotificationPage,
            currentNotificationData,
            allNotificationData,
            // 最高级权限才有的数据
            highestData,
            highestDataPagination,
            // 全部用户
            allUser,
        } = this.state
        const LogContent = ({content}) => (
            <p dangerouslySetInnerHTML={{__html: content}} />
            )
        // 工作日志
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
                                        actions={[<span className="defaultTime" href="javascript:void(0)">{moment(item.date).format('LL')}</span>]}>
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
                            extra={<Link to="/home/personal/summary" onClick={this.linkClick('/personal', `/personal/summary`)}>更多</Link>}>
                            <List
                                className="animated fadeInRight"
                                itemLayout="horizontal"
                                dataSource={summaryData}
                                sm="5"
                                xs="5"
                                renderItem={item => (
                                    <List.Item
                                        key={item.id}
                                        actions={[<Link className="defaultTime" to={`/home/personal/summary/${item.id}`} onClick={this.linkClick('/personal', `/personal/summary`)}>{moment(item.date).format('LL')}</Link>]}>
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

        // 最新通知
        const NoticeMsg = (
            <div className="NoticeMsg">
                <Card title="最新通知">
                    <List
                        pagination={{
                            pageSize: currentNotificationPageSize,
                            current: currentNotificationPage,
                            total: this.props.notificationData.length,
                            onChange: (page) => {
                                this.setState({
                                    currentNotificationPage: page
                                })
                                this.setCurrentNotificationData(page)
                            },
                        }}
                        dataSource={currentNotificationData}
                        itemLayout="horizontal"
                        renderItem={item => (
                            <List.Item actions={[item.date]}>
                                {ntfcTitle(item)}
                            </List.Item>
                        )}
                    />
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
                    {user && user.highest ? (
                        <div className="mb-10">
                            <Card title="最近项目和任务">
                                <List
                                    pagination={highestDataPagination}
                                    dataSource={highestData}
                                    itemLayout="horizontal"
                                    renderItem={item => (
                                        <List.Item actions={[item.date]}>
                                            {`${allUser.find(u => u.id === parseInt(item.data.uid)) && allUser.find(u => u.id === parseInt(item.data.uid)).realname}${item.desc}`}
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </div>
                    ) : null}
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
