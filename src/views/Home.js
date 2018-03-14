import React from 'react'

import {ajax} from 'UTILS/ajax'

import BasicLayout from '../layouts/BasicLayout.js'

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
    '/system': 'tool',
}

class Home extends React.Component {
    state = {
        routes: []
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
                                    component: getRoutes(item.component),
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
                            component: getRoutes(menu.component),
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
                                component: getRoutes(submenu.component),
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
                    routes: routes
                })
                if (res.data.length === 0) {
                    this.props.history.push('/home/no-permission')
                }
            })
        }
    }
    render() {
        return (
            <BasicLayout {...this.props} routes={this.state.routes} />
        )
    }
}

export default Home
