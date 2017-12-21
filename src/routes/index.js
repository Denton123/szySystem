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
                        component: getRoutes(['Personal', 'Attendance'])
                    },
                    {
                        name: '工作日志',
                        path: '/work-log',
                        component: getRoutes(['Personal', 'WorkLog'])
                    },
                    {
                        name: '每周总结',
                        path: '/summary',
                        component: getRoutes(['Personal', 'Summary']),
                        // routes: [
                        //     {
                        //         name: '发表总结',
                        //         path: '/add',
                        //         component: getRoutes(['Personal', 'Detail', 'SummaryDetail'])
                        //     },
                        //     {
                        //         name: '编辑总结',
                        //         path: '/:id',
                        //         component: getRoutes(['Personal', 'Detail', 'SummaryDetail'])
                        //     },
                        // ]
                    },
                    {
                        name: '发表每周总结',
                        path: '/summary/add',
                        disable: true,
                        component: getRoutes(['Personal', 'Detail', 'SummaryDetail'])
                    },
                    {
                        name: '编辑每周总结',
                        path: '/summary/:id',
                        disable: true,
                        component: getRoutes(['Personal', 'Detail', 'SummaryDetail'])
                    },
                    {
                        name: '个人信息',
                        path: '/info',
                        component: getRoutes(['Personal', 'Info'])
                    },
                    {
                        name: '我的任务',
                        path: '/my-mission',
                        component: getRoutes(['Personal', 'MyMission'])
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
                        component: getRoutes(['Project', 'Info']),
                        // routes: [
                        //     {
                        //         name: '项目详情',
                        //         path: '/:id',
                        //         component: getRoutes(['Project', 'Detail', 'ProjectDetail'])
                        //     },
                        // ]
                    },
                    {
                        name: '项目详情',
                        path: '/info/:id',
                        disable: true,
                        component: getRoutes(['Project', 'Detail', 'ProjectDetail'])
                    },
                    {
                        name: '工作日志',
                        path: '/work-log',
                        component: getRoutes(['Project', 'WorkLog'])
                    },
                    {
                        name: '项目问题',
                        path: '/problem',
                        component: getRoutes(['Project', 'Problem']),
                        // routes: [
                        //     {
                        //         name: '问题详情',
                        //         path: '/:id',
                        //         component: getRoutes(['Project', 'Detail', 'ProblemDetail'])
                        //     }
                        // ]
                    },
                    {
                        name: '问题详情',
                        path: '/problem/:id',
                        disable: true,
                        component: getRoutes(['Project', 'Detail', 'ProblemDetail'])
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
                        component: getRoutes(['Personnel', 'WorkerAffairs'])
                    },
                    {
                        name: '合同管理',
                        path: '/contract',
                        component: getRoutes(['Personnel', 'Contract'])
                    },
                    {
                        name: '招聘管理',
                        path: '/recruit',
                        component: getRoutes(['Personnel', 'Recruit'])
                    },
                    {
                        name: '考勤管理',
                        path: '/attendance',
                        component: getRoutes(['Personnel', 'Attendance'])
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
                        component: getRoutes(['Asset', 'Equipment'])
                    },
                    {
                        name: '办公用品管理',
                        path: '/stationery',
                        component: getRoutes(['Asset', 'Stationery'])
                    },
                    {
                        name: '图书管理',
                        path: '/book',
                        component: getRoutes(['Asset', 'Book'])
                    }
                ]
            },
            {
                name: '任务管理',
                icon: 'exception',
                path: '/task',
                component: getRoutes(['Task'])
            },
            {
                name: '总结概况',
                icon: 'profile',
                path: '/summary',
                component: getRoutes(['Summary'])
            },
            {
                name: '系统设置',
                icon: 'tool',
                path: '/system',
                routes: [
                    {
                        name: '设置',
                        path: '/setting',
                        component: getRoutes(['System', 'Setting'])
                    },
                    {
                        name: '权限分配',
                        path: '/permission',
                        component: getRoutes(['System', 'Permission'])
                    },
                    {
                        name: '操作日志',
                        path: '/operate-log',
                        component: getRoutes(['System', 'OperateLog'])
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
