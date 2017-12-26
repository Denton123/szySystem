/**
 * 首页
 * @description
 * @author 舒丹彤
 * @date 2017/11/30
 */
import styles from './default.less'
import React from 'react'
import moment from 'moment'
import { Layout, Breadcrumb, Icon, Card, Col, Row, Input, Avatar, List, Tooltip, Spin } from 'antd'
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
            summaryData: [],
            weatherArr: [],
            locationArr: [],
            weatherTime: [],
            loading: true
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
            time: date
        })
    }
    getData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            show(`/worklog/${id}`).then(res => {
                this.setState({
                    workLog: res.data
                })
            })
            show(`/summary/?page=1&user_id=${id}`).then(res => {
                this.setState({
                    summaryData: res.data.data
                })
            })
        }
        var longitude, latitude, cid
        const onkey = '576d7427ad2142eca98a21e9d4d5a997'
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                longitude = position.coords.longitude.toString().substr(0, 7)
                latitude = position.coords.latitude.toString().substr(0, 6)
                var location = longitude + ',' + latitude
                ajax('get', `https://free-api.heweather.com/s6/search?location=${location}&key=${onkey}`).then(res => {
                    cid = res.data.HeWeather6[0].basic.cid
                    this.setState({
                        loading: false,
                        locationArr: res.data.HeWeather6[0].basic
                    })
                }).then(() => {
                    ajax('get', `https://free-api.heweather.com/v5/now?city=${cid}&key=${onkey}`).then(res => {
                        this.setState({
                            weatherArr: resetObject(res.data.HeWeather5[0].now)
                        })
                        this.setState({
                            weatherTime: res.data.HeWeather5[0].basic.update
                        })
                    })
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
        const {workLog, summaryData, weatherArr, locationArr, weatherTime, loading} = this.state
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
                                        key={item.id}
                                        actions={[<span>{moment(item.date).format('LL')}</span>]}>
                                        <Tooltip title={item.content} placement="top">
                                            <List.Item.Meta
                                                description={<LogContent content={item.content} />} />
                                        </Tooltip>
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
                                        key={item.id}
                                        actions={[<span>{moment(item.date).format('LL')}</span>]}>
                                        <Tooltip title={<LogContent content={item.content} />} placement="top">
                                            <List.Item.Meta
                                                description={<LogContent content={item.content} />} />
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
        const Location = ({area, city, location}) => (
            <div style={{marginRight: 30}}>
                <Icon type="environment" className="mr-10" />
                {area}-{city}-{location}
            </div>
            )
        const DetailWeather = (
            <div>
                <span style={{color: '#1890ff', marginRight: 30}}>
                    <span style={{fontSize: 35}}>{`${weatherArr.tmp}°`}</span>
                    <span>{weatherArr.txt}</span>
                </span>
                <ul style={{display: 'inline-block'}}>
                    <li>{weatherArr.dir}-{weatherArr.sc}</li>
                    <li>{`体感温度  ${weatherArr.fl}℃`}</li>
                    <li>{`能见度  ${weatherArr.vis}%`}</li>
                    <li>{`气压  ${weatherArr.pres}hpa`}</li>
                    <li>{`降水量  ${weatherArr.pcpn}mm`}</li>
                    <li>{`相对湿度  ${weatherArr.hum}%`}</li>
                </ul>
            </div>
            )
        const updateTime = moment(weatherTime.loc).startOf('hour').fromNow()
        const Weather = (
            <Spin spinning={this.state.loading}>
                <Card title={<Location
                    area={locationArr.admin_area}
                    city={locationArr.parent_city}
                    location={locationArr.location} />}
                    extra={`${updateTime}更新`}>
                    {DetailWeather}
                </Card>
            </Spin>
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
                        <p className="Time tada animated">{moment().format('L a h:mm:ss')}</p>
                    </div>
                </Header>
                <div className="Main">
                    <div className="CardWrap">
                        {CardMsg}
                        <div className="Weather">
                            {Weather}
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
