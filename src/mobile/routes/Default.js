import React from 'react'
import moment from 'moment'
import zhCn from 'moment/locale/zh-cn'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import { Card, List, WhiteSpace, WingBlank } from 'antd-mobile'

import { ajax, mIndex, mShow } from '../../utils/ajax.js'
import {ntfcTitle, ntfcUrl, ntfcDesc} from '../../utils/notification.js'

moment.locale('zh-cn')

class Default extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            worklog: [],
            summaryData: [],
            allUser: [], // 全部用户
            // 最高权限才能查看 ----------
            highestData: [],
        }
    }
    componentWillMount() {
        this.props.setCustomNavBarState(this.props.route.name, 'menu')
        this.getData()
        if (this.props.user && this.props.user.highest) { // 只有最高权限才能查看
            this.getAllUser()
            this.getHighestData()
        }
    }
    getData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            axios.get(`/m/worklog/default?page=1&user_id=${id}&pageSize=5`).then(res => {
                this.setState({
                    worklog: res.data.data
                })
            })
            mShow(`/summary?page=1&user_id=${id}&pageSize=5&page=1`).then(res => {
                this.setState({
                    summaryData: res.data.data
                })
            })
        }
    }
    // 获取通知信息（最高级权限才能查看)
    getHighestData = (page = 1) => {
        mIndex(`notification`, { page: page })
            .then(res => {
                let notification = res.data.data
                notification.forEach(n => {
                    n['data'] = JSON.parse(n['data'])
                    n['desc'] = ntfcDesc(n)
                })
                this.setState(prveState => {
                    return {
                        highestData: notification,
                    }
                })
            })
    }
    // 获取全部用户信息
    getAllUser = () => {
        ajax('get', '/m/user/all')
            .then(res => {
                this.setState({
                    allUser: res.data
                })
            })
    }

    render() {
        const user = this.props.user
        const {
            worklog,
            summaryData,
            time,
            // 最高级权限才有的数据
            highestData,
            // 全部用户
            allUser,
        } = this.state
        const LogContent = ({content}) => (
            <p dangerouslySetInnerHTML={{__html: content}} />
        )
        return (
            <div>
                {user && user.highest ? (
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                            <Card.Header
                                title="最近项目和任务"
                                extra={<Link to="/home/personal/work-log">更多</Link>}
                            />
                            <Card.Body>
                                {highestData.map(hd => (
                                    <Card full key={hd.id}>
                                        <Card.Body>
                                            {hd.type === 'status'
                                            ? `${hd.data.Users[0].realname}${hd.desc}`
                                            : `${allUser.find(u => u.id === parseInt(hd.data.uid)) && allUser.find(u => u.id === parseInt(hd.data.uid)).realname}${hd.desc}`}
                                        </Card.Body>
                                        <Card.Footer extra={<div>{hd.date}</div>} />
                                    </Card>
                                ))}
                            </Card.Body>
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>
                ) : null}
                <WingBlank size="lg">
                    <Card>
                        <Card.Header
                            title="工作日志"
                            extra={<Link to="/home/personal/work-log">更多</Link>}
                        />
                        <Card.Body>
                            {worklog.length > 0 ? worklog.map(wl => (
                                <Card full key={wl.id}>
                                    <Card.Body>
                                        <LogContent content={wl.content} />
                                    </Card.Body>
                                    <Card.Footer extra={<span>{moment(wl.date).format('LL')}</span>} />
                                </Card>
                            )) : (<div>暂无数据</div>)}
                        </Card.Body>
                    </Card>
                    <WhiteSpace size="lg" />
                </WingBlank>
                <WingBlank size="lg">
                    <Card>
                        <Card.Header
                            title="个人总结"
                            extra={<Link to="/home/personal/summary">更多</Link>}
                        />
                        <Card.Body>
                            {summaryData.length > 0 ? summaryData.map(sd => (
                                <Card full key={sd.id}>
                                    <Card.Header
                                        title={<LogContent content={sd.title} />}
                                        extra={<Link to={`/home/personal/summary/${sd.id}`}>查看</Link>}
                                    />
                                    <Card.Body>
                                        <LogContent content={sd.content} />
                                    </Card.Body>
                                    <Card.Footer extra={<span>{moment(sd.date).format('LL')}</span>} />
                                </Card>
                            )) : (<div>暂无数据</div>)}
                        </Card.Body>
                    </Card>
                    <WhiteSpace size="lg" />
                </WingBlank>
            </div>
        )
    }
}

export default Default
