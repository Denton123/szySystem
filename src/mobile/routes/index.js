import React from 'react'

function getViews(model) {
    return require(`../views/${model}`).default
}

function getRoutes(path) {
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`.${route}`).default
}

const routes = [
    {
        path: '/home',
        exact: true,
        component: getViews('Home'),
        name: 'home',
        routes: [
            {
                name: '首页',
                path: '/default',
                component: getRoutes(['Default']),
                key: 'default'
            },
            {
                name: '公司情况',
                path: '/company',
                component: getRoutes(['Company']),
                key: 'company',
                routes: [
                    {
                        name: '列表页',
                        path: '/:model',
                        component: getRoutes(['Company', 'CompanyDetail'])
                    },
                    {
                        name: '详情',
                        path: '/:model/:detail',
                        component: getRoutes(['Company', 'CompanyDetailDetail'])
                    }
                ]
            },
            {
                name: '工作',
                path: '/work',
                component: getRoutes(['Work']),
                key: 'work',
                routes: [
                    {
                        name: '动态模块',
                        path: '/:model',
                        component: getRoutes(['Work', 'Model']),
                    },
                    {
                        name: '动态模块详情',
                        path: '/:model/:detail',
                        component: getRoutes(['Work', 'ModelDetail']),
                    },
                ]
            },
            {
                name: '我的',
                path: '/my',
                component: getRoutes(['My']),
                key: 'my',
                routes: [
                    {
                        name: '用户信息',
                        path: '/userinfo',
                        component: getRoutes(['My', 'UserInfo']),
                    },
                ]
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: getViews('Login')
    },
    {
        path: '/*',
        name: '404',
        component: getViews('NotMatch')
    }
]

export default routes
