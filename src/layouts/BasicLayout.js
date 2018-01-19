/**
 * 整体页面架构
 * @description
 * @author 吴燕萍
 * @date 2017/11/22
 */
import styles from './BasicLayout.less'
import 'STYLE/css/theme.less'
import React from 'react'
import cs from 'classnames'
import 'UTILS/weather.js'
import {
    Layout,
    Menu,
    Breadcrumb,
    Icon,
    Dropdown,
    Avatar,
    Tabs,
    Popover,
    List,
    Button
} from 'antd'

import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {ajax} from 'UTILS/ajax'
import {isArray} from 'UTILS/utils'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu
const TabPane = Tabs.TabPane

// 重整路由结构
function resetRoute(routes, permissionRoute) {
    let arr = []
    routes.forEach(r => {
        let obj = {}
        if (r.routes) {
            r.routes.forEach(rc => {
                if (rc.routes) {
                    let children = []
                    rc.routes.forEach(rcc => {
                        obj = {
                            component: rcc.component,
                            name: `${r.name},${rc.name},${rcc.name}`,
                            path: `${r.path}${rc.path}${rcc.path}`
                        }
                        if (permissionRoute.find(k => k.path === rcc.path)) {
                            children.push(obj)
                        }
                    })
                    arr.push(children)
                }
                obj = {
                    component: rc.component,
                    name: `${r.name},${rc.name}`,
                    path: `${r.path}${rc.path}`
                }
                if (permissionRoute.find(k => k.path === rc.path)) {
                    arr.push(obj)
                }
            })
        } else {
            obj = {
                component: r.component,
                name: r.name,
                path: r.path
            }
            if (permissionRoute.find(k => k.path === r.path)) {
                arr.push(obj)
            }
            if (r.path === '/404' || r.path === '/no-permission') { // 404默认加入
                arr.push(obj)
            }
        }
    })
    return arr
}

// 模块的内容
const ModelContent = ({breadcrumbs, children}) => (
    <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbs.map((breadcrumb, idx) => (
                <Breadcrumb.Item key={idx}>{breadcrumb}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
        {children}
    </Content>
)

class BasicLayout extends React.Component {
    rootSubmenuKeys = this.props.routes.map((route, idx) => {
        return route.path
    })
    state = {
        selectedKeys: [this.rootSubmenuKeys[0]],
        openKeys: [this.rootSubmenuKeys[0]],
        // 通知需要的状态
        notificationActiveTab: 'Project',
        notificationData: {
            'Project': [],
            'Task': [],
            'Problem': []
        },
        notificationLoading: true,
    }
    componentDidMount() {
        let currentPath = this.props.location.pathname.split('home')[1]
        if (currentPath.split('/').length > 2) {
            this.setState({
                openKeys: [`/${currentPath.split('/')[1]}`],
                selectedKeys: [currentPath]
            })
        } else {
            this.setState({
                selectedKeys: [currentPath]
            })
        }

        tpwidget('show') // 天气
        // websocket 通知
        const socket = io('http://localhost:3000')
        socket.on('notification', (notification) => {
            console.log(notification)
            if (isArray(notification)) { // 多条通知
                this.setState(prevState => {
                    let obj = prevState.notificationData
                    notification.forEach(n => {
                        if (n.Users.find(user => user.id === this.props.user.id)) {
                            obj[n.model].unshift(n)
                        }
                    })
                    return {
                        notificationData: obj
                    }
                })
            } else { // 单条通知
                if (notification.isPublic === '1') { // 全部人都能看到
                    this.setState(prevState => {
                        let obj = prevState.notificationData
                        obj[notification.model].unshift(notification)
                        return {
                            notificationData: obj
                        }
                    })
                }
            }
        })

        // 获取未读通知
        this.getNotificationData()
    }

    /**
     * [获取所有未读通知]
     * @Author   szh
     * @DateTime 2018-01-17
     */
    getNotificationData = () => {
        this.setState({
            notificationLoading: true
        })
        ajax('get', '/notification', {
            uid: this.props.user.id
        })
        .then(res => {
            this.setState(prevState => {
                let obj = {
                    'Project': [],
                    'Task': [],
                    'Problem': []
                }
                res.data.forEach(d => {
                    obj[d.model].push(d)
                })
                return {
                    notificationData: {
                        ...obj,
                    },
                    notificationLoading: false
                }
            })
        })
    }

    /**
     * [设置已读]
     * @Author   szh
     * @DateTime 2018-01-18
     * @param    {Array}   nids [设置已读的通知ids]
     */
    setNotificationRead = (nids) => {
        ajax('put', '/notification/read', {
            user_id: this.props.user.id,
            notification_ids: nids
        })
        .then(res => {
            if (res.data.length > 0) {
                this.setState(prevState => {
                    let obj = prevState.notificationData
                    res.data.forEach(d => {
                        obj[d.model].splice(
                            obj[d.model].findIndex(idx => idx.id === d.id),
                            1
                        )
                    })
                    return {
                        notificationData: obj
                    }
                })
            } else {
                // 没有该通知
            }
        })
    }

    // 单个已读
    singleNotificationRead = (e) => {
        let id = e.target.dataset['id']
        this.setNotificationRead([parseInt(id)])
    }

    // 多个已读
    multipleNotificationRead = (type) => {
        let nids = []
        this.state.notificationData[type].forEach(n => {
            nids.push(n.id)
        })
        this.setNotificationRead(nids)
    }

    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys })
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            })
        }
    }

    onClick = ({ item, key, selectedKeys }) => {
        this.setState({
            selectedKeys: [key]
        })
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    /**
     * [登出]
     * @Author   szh
     * @DateTime 2018-01-17
     */
    logout = () => {
        axios.get('/user/logout')
        .then(res => {
            this.props.globalUpdateUser(null)
            this.props.history.push('/login')
        })
        .catch(err => {
            console.log(err)
        })
    }

    isDisplay = (route) => {
        if (this.props.permissionRoute.find(k => k.path === route.path)) {
            return true
        } else {
            return false
        }
    }

    /**
     * [生成单条通知结构]
     * @Author   szh
     * @DateTime 2018-01-18
     * @param    {Object}   ntfc [通知数据]
     * @return   {ReactNode}     [单个通知结构]
     */
    notificationMsg = (ntfc) => {
        let data = JSON.parse(ntfc.data)
        const modelFn = {
            Project: (data) => {
                if (ntfc.type === 'add') {
                    return <div>{ntfc.id}</div>
                } else if (ntfc.type === 'edit') {
                    return <div>{ntfc.id}</div>
                } else if (ntfc.type === 'delete') {
                    return <div>{ntfc.id}</div>
                }
            },
            Problem: (data) => {
                if (ntfc.type === 'add') {
                    return <div>{ntfc.id}</div>
                } else if (ntfc.type === 'edit') {
                    return <div>{ntfc.id}</div>
                } else if (ntfc.type === 'delete') {
                    return <div>{ntfc.id}</div>
                }
            },
            Task: (data) => {
                let users = ''
                // data.Users.forEach(u => {
                //     users += `${u.realname}、`
                // })
                // users = users.substring(0, users.length - 1)
                if (ntfc.type === 'add') {
                    return <div>{`${ntfc.send_uid}发布了新任务,执行者有你`}</div>
                } else if (ntfc.type === 'edit') {
                    return <div>{`${ntfc.send_uid}更新了一个任务,执行者有你`}</div>
                } else if (ntfc.type === 'delete') {
                    return <div>{`${ntfc.send_uid}删除了一个任务,执行者有你`}</div>
                }
            }
        }
        return modelFn[ntfc.model](data)
    }

    render() {
        const {
            routes,
            history,
            location,
            match,
            user,
            collapsed,
            permissionRoute
        } = this.props
        const newRoute = resetRoute(routes, permissionRoute)
        const AvatarMenu = (
            <Menu>
                <Menu.Item key="0">
                    <Link to="/home/personal/info"><Icon type="idcard" style={{marginRight: '8px'}} />个人信息</Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Link to="/home/system/setting"><Icon type="setting" style={{marginRight: '8px'}} />设置</Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">
                    <span onClick={this.logout}><Icon type="logout" style={{marginRight: '8px'}} />退出登录</span>
                </Menu.Item>
            </Menu>
        )

        const dynamicSider = (
            <div>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={this.state.selectedKeys}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    onClick={this.onClick}
                >
                    {routes.map((route, idx) => {
                        if (route.routes) {
                            return (
                                <SubMenu
                                    className={this.isDisplay(route) ? '' : 'hide'}
                                    key={route.path}
                                    title={<span><Icon type={route.icon} style={{fontSize: 16}} /><span style={{fontSize: 14}}>{route.name}</span></span>}
                                >
                                    {
                                        route.routes.map((child, sn) => (
                                            <Menu.Item key={`${route.path}${child.path}`} className={this.isDisplay(child) ? '' : 'hide'}>
                                                <Link to={`${match.path}${route.path}${child.path}`}>{child.name}</Link>
                                            </Menu.Item>
                                        ))
                                    }
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item key={route.path} className={this.isDisplay(route) ? '' : 'hide'}>
                                    <Link to={`${match.path}${route.path}`}>
                                        <Icon type={route.icon} style={{fontSize: 16}} />
                                        <span style={{fontSize: 14}}>{route.name}</span>
                                    </Link>
                                </Menu.Item>
                            )
                        }
                    })}
                </Menu>
            </div>
        )
        const tabs = [
            {tab: '项目', key: 'Project'},
            {tab: '任务', key: 'Task'},
            {tab: '问题', key: 'Problem'},
        ]
        const notification = (
            <Tabs defaultActiveKey={this.state.notificationActiveTab}>
                {tabs.map(item => (
                    <TabPane tab={item.tab} key={item.key}>
                        {this.state.notificationData[item.key].length > 0 ? (
                            <div className="txt-c">
                                <List
                                    loading={this.state.notificationLoading}
                                    dataSource={this.state.notificationData[item.key]}
                                    itemLayout="horizontal"
                                    renderItem={item => (
                                        <List.Item actions={[<a data-id={item.id} onClick={this.singleNotificationRead}>设为已读</a>]}>
                                            {this.notificationMsg(item)}
                                        </List.Item>
                                    )}
                                />
                                <Button onClick={() => this.multipleNotificationRead(item.key)}>清除全部通知</Button>
                            </div>
                        ) : (
                            <div className="txt-c" styles={{width: 370}}>
                                已经查看所有通知
                            </div>
                        )}
                    </TabPane>
                ))}
            </Tabs>
        )

        const dynamicLayout = (
            <div>
                <Header className="layout-header" >
                    <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <div className="pull-right layout-header-avatar">
                        <Dropdown overlay={AvatarMenu}>
                            <div style={{ lineHeight: '64px' }}>
                                <Avatar style={{ verticalAlign: 'middle' }} src={user && user.avatar ? `/uploadImgs/${user.avatar}` : null} icon="user" />
                                <span className="ml-10">{user && user.realname ? user.realname : '请先登录'}</span>
                            </div>
                        </Dropdown>
                    </div>
                    <div className="pull-right layout-header-bell mr-10">
                        <div id="tp-weather-widget" style={{display: 'inline-block'}} className="mr-10" />
                        <Popover placement="bottomRight" content={notification} trigger="click">
                            <Icon type={'bell'} style={{fontSize: 16}} />
                        </Popover>
                    </div>
                </Header>
                <Route exact path={match.path} render={() => {
                    return <Redirect to={`${match.path}/default`} />
                }} />
                {
                    newRoute.map((route, idx) => {
                        if (isArray(route)) {
                            return (
                                <Switch key={idx}>
                                    {
                                        route.map((rc, sn) => (
                                            <Route
                                                key={sn}
                                                exact
                                                path={`${match.path}${rc.path}`}
                                                render={props => (
                                                    <ModelContent breadcrumbs={rc.name.split(',')}>
                                                        <rc.component route={rc} {...props} user={this.props.user} globalUpdateUser={this.props.globalUpdateUser} />
                                                    </ModelContent>
                                                )} />
                                        ))
                                    }
                                </Switch>
                            )
                        } else {
                            return (
                                <Route
                                    key={idx}
                                    exact
                                    path={`${match.path}${route.path}`}
                                    render={props => (
                                        <ModelContent breadcrumbs={route.name.split(',')}>
                                            <route.component route={route} {...props} user={this.props.user} globalUpdateUser={this.props.globalUpdateUser} />
                                        </ModelContent>
                                    )} />
                            )
                        }
                    })
                }
                <Footer style={{ textAlign: 'center' }}>
                    szy公司系统 ©2017 Created by szy
                </Footer>
            </div>
        )
        const Class = cs({
            [`${user && user.skin}`]: user && user.skin !== null,
            [`${user && user.font_size}`]: user && user.font_size !== null,
            default: user && user.skin === null,
            middle: user && user.font_size === null,
            BasicLayout: true
        })
        return (
            <Layout
                style={{ minHeight: '100vh' }}
                className={Class}
            >
                <Sider
                    className="Sider"
                    collapsed={this.state.collapsed}
                >
                    {dynamicSider}
                </Sider>
                <Layout>
                    {dynamicLayout}
                </Layout>
            </Layout>
        )
    }
}

export default BasicLayout
