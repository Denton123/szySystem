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
                component: () => <div>默认页</div>
            },
            {
                name: '个人事务管理',
                path: '/personalAffairs',
                routes: [
                    {
                        name: '考勤',
                        path: '/checkWork',
                        component: () => <div>checkwork</div>
                    },
                    {
                        name: '每日日志',
                        path: '/dayLog',
                        component: () => <div>dayLog</div>
                    }
                ]
            },
            {
                name: '项目管理',
                path: '/project',
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
                name: '测试',
                path: '/test',
                component: () => <div>test</div>
            },
            {
                name: '测试1',
                path: '/test1',
                component: () => <div>test1</div>
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
        <div>
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
        </div>
    </Router>
)

export default App
