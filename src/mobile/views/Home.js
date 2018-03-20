import React from 'react'

import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    Link,
} from 'react-router-dom'

import {ajax} from 'UTILS/ajax'

import { TabBar, List, Drawer } from 'antd-mobile'

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
            ajax('get', '/permission/all-menu')
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
                                    path: item.path
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
    renderContent(pageText) {
        return (
            <div style={{ backgroundColor: 'white', height: '100%', textAlign: 'center' }}>
                <div style={{ paddingTop: 60 }}>Clicked “{pageText}” tab， show “{pageText}” information</div>
                <a style={{ display: 'block', marginTop: 40, marginBottom: 20, color: '#108ee9' }}
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    Click to show/hide tab-bar
                </a>
                <a style={{ display: 'block', marginBottom: 600, color: '#108ee9' }}
                    onClick={(e) => {
                        e.preventDefault()
                    }}
                >
                    Click to switch fullscreen
                </a>
            </div>
        )
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
        const sidebar = (
            <List>
                {permissionRoutes.map((menu, i) => (
                    <List.Item key={menu.path}>
                        <Link to={`${match.path}${menu.path}`}>
                            {menu.name}
                        </Link>
                    </List.Item>
                ))}
            </List>
        )
        return (
            <div className="w100 h100">
                <CustomNavBar {...CustomNavBarState} />
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight - 45 }}
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center' }}
                    sidebar={sidebar}
                    open={drawerOpen}
                    onOpenChange={this.onOpenChange}
                >
                    <Route exact path={match.path} render={() => {
                        return <Redirect to={`${match.path}/default`} />
                    }} />
                    <TabBar hidden={hiddenTabBar}>
                        {routes.map(route => (
                            <TabBar.Item
                                title={route.name}
                                key={route.key}
                                selected={currentTab === route.key}
                                onPress={() => {
                                    this.setState({
                                        currentTab: route.key,
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
                                            globalUpdateUser={this.props.globalUpdateUser}
                                        />
                                    )}
                                />
                            </TabBar.Item>
                        ))}
                    </TabBar>
                </Drawer>
            </div>
        )
    }
}

export default Home
