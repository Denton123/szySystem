import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'

function getViews(model) {
    return require(`VIEWS/${model}`).default
}
function getCom(pro, com) {
    return require(`ROUTES/${pro}/${com}`).default
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
                component: () => <div>默认页</div>,
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
                        component: getCom('PersonalAffairs', 'checkWork')
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
                icon: 'usergroup-add',
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
                icon: 'red-envelope',
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
                icon: 'exception',
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
                icon: 'tool',
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

const auth = true

const App = () => (
    <Router>
        <Switch>
            <Route exact path="/" render={() => (
                auth ? (
                    <Redirect to="/home" />
                ) : (
                    <Redirect to="/login" />
                )
            )} />
            {routes.map((com, idx) => (
                <Route
                    key={idx}
                    path={com.path}
                    render={props => (
                        <com.component {...props} routes={com.routes} />
                    )} />
            ))}
        </Switch>
    </Router>
)

export default App
