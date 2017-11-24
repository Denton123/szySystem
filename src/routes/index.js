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
                path: '/personalAffairs',
                icon: 'solution',
                routes: [
                    {
                        name: '考勤',
                        path: '/checkWork',
                        component: getRoutes(['PersonalAffairs', 'CheckWork'])
                    },
                    {
                        name: '每日日志',
                        path: '/dayLog',
                        component: () => <div>dayLog</div>
                    },
                    {
                        name: '周总结',
                        path: '/weekSummary',
                        component: () => <div>checkwork</div>
                    },
                    {
                        name: '个人信息',
                        path: '/personalInfo',
                        component: () => <div>dayLog</div>
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
                        path: '/projectInfo',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '项目申请管理',
                        path: '/projectApply',
                        component: () => <div>projectApply</div>
                    },
                    {
                        name: '分配管理',
                        path: '/projectDistribute',
                        component: () => <div>projectDistribute</div>
                    },
                    {
                        name: '工作日志',
                        path: '/workLog',
                        component: () => <div>workLog</div>
                    }
                ]
            },
            {
                name: '人事管理',
                path: '/workers',
                routes: [
                    {
                        name: '人员管理',
                        path: '/workerAffairs',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '合同管理',
                        path: '/contract',
                        component: () => <div>projectApply</div>
                    },
                    {
                        name: '招聘管理',
                        path: '/recruit',
                        component: () => <div>projectDistribute</div>
                    },
                    {
                        name: '考勤管理',
                        path: '/checkWorkers',
                        component: () => <div>workLog</div>
                    }
                ]
            },
            {
                name: '资产管理',
                path: '/property',
                routes: [
                    {
                        name: '设备管理',
                        path: '/workerAffairs',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '办公用品管理',
                        path: '/contract',
                        component: () => <div>projectApply</div>
                    },
                    {
                        name: '图书管理',
                        path: '/recruit',
                        component: () => <div>projectDistribute</div>
                    }
                ]
            },
            {
                name: '任务管理',
                path: '/task',
                routes: [
                    {
                        name: '任务信息',
                        path: '/taskInfo',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '历史任务',
                        path: '/historyTask',
                        component: () => <div>projectApply</div>
                    }
                ]
            },
            {
                name: '系统设置',
                path: '/setting',
                routes: [
                    {
                        name: '主题设置',
                        path: '/setTheme',
                        component: () => <div>projectInfo</div>
                    },
                    {
                        name: '修改密码',
                        path: '/modifyPsw',
                        component: () => <div>projectApply</div>
                    },
                    {
                        name: '权限分配',
                        path: '/permission',
                        component: () => <div>projectDistribute</div>
                    },
                    {
                        name: '操作日志',
                        path: '/operateLog',
                        component: () => <div>projectDistribute</div>
                    }
                ]
            },
            {
                name: '测试',
                path: '/test',
                component: () => <div>test</div>,
                icon: 'home'
            },
            {
                name: '测试1',
                path: '/test1',
                component: () => <div>test1</div>,
                icon: 'home'
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
