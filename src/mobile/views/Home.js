import React from 'react'
import { TabBar, List, Drawer, Icon } from 'antd-mobile'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import {ajax} from 'UTILS/ajax'

import CustomNavBar from '../components/CustomNavBar'

import './Home.less'

function getRoutes(path) {
    if (path === null) {
        return null
    } else {
        path = path.split(',')
    }
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`../routes${route}`).default
}

const icons = {
    '/default': 'home',
    '/personal': 'solution',
    '/project': 'switcher',
    '/personnel': 'usergroup-add',
    '/asset': 'red-envelope',
    '/task': 'exception',
    '/work': 'schedule',
    '/share': 'share-alt',
    // '/system': 'tool',
}

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // NavBar 状态
            CustomNavBarState: {
                title: '首页',
                icon: 'ellipsis',
                leftClick: this.onOpenChange
            },

            // Drawer
            drawerOpen: false,

            // TabBar 状态
            currentTab: 'default', // 当前选中的菜单
            hiddenTabBar: false, // 是否隐藏下方菜单栏

            permissionRoutes: [],
        }
    }
    componentWillMount() {
        // 判断用户是否登录
        if (this.props.user === null) {
            this.props.history.push('/login')
        } else {
            // 动态确定当前路由
            let currentPath = this.props.location.pathname
            this.props.routes.find(r => {
                if (currentPath.indexOf(r.path) > -1) {
                    this.setState(prevState => {
                        return {
                            CustomNavBarState: {
                                ...prevState.CustomNavBarState,
                                title: r.name,
                            },
                            currentTab: r.key,
                        }
                    })
                }
            })
            ajax('get', '/m/permission/all-menu')
            .then(res => {
                let permissionRoute = res.data
                let routes = []
                permissionRoute.forEach(menu => {
                    if (menu.pid) {
                        let tempRoutes = []
                        // 把详情页分类到对应的子级菜单中
                        res.data.map(item => {
                            if (item.pid === menu.id) {
                                tempRoutes.push({
                                    // component: getRoutes(item.component),
                                    name: item.name,
                                    path: item.path,
                                    component: item.component
                                })
                            }
                        })
                        if (tempRoutes.length > 0) {
                            menu['routes'] = tempRoutes
                        }
                    } else {
                        // 记录父级菜单
                        routes.push({
                            id: menu.id,
                            // component: getRoutes(menu.component),
                            name: menu.name,
                            path: menu.path,
                            icon: icons[menu.path],
                            component: menu.component
                        })
                    }
                })
                // 把子级菜单添加到父级菜单中
                routes.forEach(menu => {
                    let tempRoutes = []
                    permissionRoute.map(submenu => {
                        if (menu.id === submenu.pid) {
                            let obj = {
                                // component: getRoutes(submenu.component),
                                name: submenu.name,
                                path: submenu.path,
                                component: submenu.component
                            }
                            if (submenu['routes']) {
                                obj['routes'] = submenu['routes']
                            }
                            tempRoutes.push(obj)
                        }
                    })
                    if (tempRoutes.length > 0) {
                        menu['routes'] = tempRoutes
                    }
                })
                this.setState({
                    permissionRoutes: routes
                })
                if (res.data.length === 0) {
                    this.props.history.push('/home/no-permission')
                }
            })
        }
    }
    // 改变drawer是否打开
    onOpenChange = () => {
        this.setState({
            drawerOpen: !this.state.drawerOpen
        })
    }
    // 返回
    goBack = () => {
        this.props.history.go(-1)
    }

    // 导航栏设置
    setCustomNavBarState = (title, type = 'menu') => {
        if (type === 'menu') {
            this.setState({
                CustomNavBarState: {
                    title: title,
                    icon: 'ellipsis',
                    leftClick: this.onOpenChange,
                },
            })
        } else if (type === 'back') {
            this.setState({
                CustomNavBarState: {
                    title: title,
                    icon: 'left',
                    leftClick: this.goBack
                },
            })
        } else {
            console.error('setCustomNavBarState的第一参数为名称，第二参数为类型（menu 和 back两种）')
        }
    }

    // 自定义更新组件的
    handleSetState = (stateFields, stateValue) => {
        this.setState({
            [stateFields]: stateValue
        })
    }

    render() {
        const {
            match,
            routes
        } = this.props
        const {
            CustomNavBarState,
            drawerOpen,
            currentTab,
            hiddenTabBar,
            permissionRoutes,
        } = this.state
        // drawer 导航菜单
        const DrawerSiderBar = (
            <List>
                {permissionRoutes.map((menu, i) => (
                    <List.Item key={menu.path} onClick={this.onOpenChange}>
                        <Link to={`${match.path}/company${menu.path}`}>
                            {menu.name}
                        </Link>
                    </List.Item>
                ))}
            </List>
        )
        // 可以跳转到通知页
        const NavBarRightContent = (
            <Icon type="search" />
        )
        return (
            <div className="w100 h100">
                <CustomNavBar {...CustomNavBarState} rightContent={NavBarRightContent} />
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight - 45 }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                    sidebar={DrawerSiderBar}
                    open={drawerOpen}
                    onOpenChange={this.onOpenChange}
                >
                    <TabBar hidden={hiddenTabBar}>
                        {routes.map(route => (
                            <TabBar.Item
                                title={route.name}
                                key={route.key}
                                selected={currentTab === route.key}
                                onPress={() => {
                                    this.setState({
                                        CustomNavBarState: {
                                            title: route.name,
                                            icon: 'ellipsis',
                                            leftClick: this.onOpenChange,
                                        },
                                        currentTab: route.key,
                                        drawerOpen: false,
                                    })
                                    this.props.history.push(`${match.path}${route.path}`)
                                }}
                                icon={<div style={{
                                    width: '0px',
                                    height: '0px'}}
                                />}
                                selectedIcon={<div style={{
                                    width: '0px',
                                    height: '0px' }}
                                />}
                            >
                                <Route
                                    exact
                                    path={`${match.path}${route.path}`}
                                    render={props => (
                                        <route.component
                                            route={route} {...props}
                                            user={this.props.user}
                                            permissionRoutes={permissionRoutes}
                                            handleSetState={this.handleSetState}
                                            CustomNavBarState={this.state.CustomNavBarState}
                                            globalUpdateUser={this.props.globalUpdateUser}
                                            setCustomNavBarState={this.setCustomNavBarState}
                                        />
                                    )} />
                                {route.routes && route.routes.length > 0
                                ? (
                                    <Switch>
                                        {route.routes.map(subRoute => (
                                            <Route
                                                key={subRoute.path}
                                                exact
                                                path={`${match.path}${route.path}${subRoute.path}`}
                                                render={props => (
                                                    <subRoute.component
                                                        route={subRoute} {...props}
                                                        user={this.props.user}
                                                        permissionRoutes={permissionRoutes}
                                                        globalUpdateUser={this.props.globalUpdateUser}
                                                        setCustomNavBarState={this.setCustomNavBarState}
                                                    />
                                                )} />
                                        ))}
                                    </Switch>
                                )
                                : null}
                            </TabBar.Item>
                        ))}
                    </TabBar>
                </Drawer>
                <Route exact path={match.path} render={() => {
                    return <Redirect to={`${match.path}/default`} />
                }} />
            </div>
        )
    }
}

export default Home
