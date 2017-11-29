import React from 'react'

function getViews(model) {
    return require(`VIEWS/${model}`).default
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
                icon: 'home'
            },
            {
                name: '个人事务管理',
                path: '/personal',
                icon: 'solution',
                routes: [
                    {
                        name: '考勤',
                        path: '/attendance',
                        component: getRoutes(['PersonalAffairs', 'CheckWork'])
                    },
                    {
                        name: '工作日志',
                        path: '/work-log',
                        component: () => <div>work-log</div>
                    },
                    {
                        name: '每周总结',
                        path: '/summary',
                        component: () => <div>summary</div>
                    },
                    {
                        name: '个人信息',
                        path: '/info',
                        component: () => <div>info</div>
                    },
                    {
                        name: '我的任务',
                        path: '/my-mission',
                        component: () => <div>my-mission</div>
                    }
                ]
            },
            {
                name: '项目管理',
                path: '/project',
                icon: 'switcher',
                routes: [
                    {
                        name: '项目信息',
                        path: '/info',
                        component: () => <div>info</div>
                    },
                    {
                        name: '工作日志',
                        path: '/work-log',
                        component: () => <div>workLog</div>
                    },
                    {
                        name: '项目问题',
                        path: '/problem',
                        component: () => <div>problem</div>
                    }
                ]
            },
            {
                name: '人事管理',
                icon: 'usergroup-add',
                path: '/personnel',
                routes: [
                    {
                        name: '人员管理',
                        path: '/worker-affairs',
                        component: () => <div>worker-affairs</div>
                    },
                    {
                        name: '合同管理',
                        path: '/contract',
                        component: () => <div>contract</div>
                    },
                    {
                        name: '招聘管理',
                        path: '/recruit',
                        component: () => <div>recruit</div>
                    },
                    {
                        name: '考勤管理',
                        path: '/attendance',
                        component: () => <div>attendance</div>
                    }
                ]
            },
            {
                name: '资产管理',
                icon: 'red-envelope',
                path: '/asset',
                routes: [
                    {
                        name: '设备管理',
                        path: '/equipment',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '办公用品管理',
                        path: '/stationery',
                        component: () => <div>projectApply</div>
                    },
                    {
                        name: '图书管理',
                        path: '/book',
                        component: () => <div>projectDistribute</div>
                    }
                ]
            },
            {
                name: '任务管理',
                icon: 'exception',
                path: '/task',
                component: () => <div>task</div>
            },
            {
                name: '系统设置',
                icon: 'tool',
                path: '/system',
                routes: [
                    {
                        name: '设置',
                        path: '/setting',
                        component: () => <div>setting</div>
                    },
                    {
                        name: '权限分配',
                        path: '/permission',
                        component: () => <div>permission</div>
                    },
                    {
                        name: '操作日志',
                        path: '/operate-log',
                        component: () => <div>operate-log</div>
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: getViews('Login')
    },
    {
        path: '/register',
        name: 'register',
        component: getViews('Register')
    },
    {
        path: '/*',
        name: '404',
        component: getViews('NotMatch')
    }
]

export default routes
