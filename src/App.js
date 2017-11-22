import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'

function getViews(model) {
    return require(`VIEWS/${model}`).default
}

function CheckWork() {
    return (
        <div>checkwork</div>
    )
}

function DayLog() {
    return (
        <div>dayLog</div>
    )
}

const routes = [
    {
        path: '/',
        exact: true,
        component: getViews('Home'),
        routes: [
            {
                name: '个人事务管理',
                path: '/personalAffairs',
                component: CheckWork,
                routes: [
                    {
                        name: '考勤',
                        path: '/checkWork',
                        component: CheckWork
                    },
                    {
                        name: '每日日志',
                        path: '/dayLog',
                        component: DayLog
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: getViews('Login')
    },
    {
        path: '/register',
        component: getViews('Register')
    },
    {
        component: getViews('NotMatch')
    }
]

const App = () => (
    <Router>
        <Switch>
            {routes.map((com, idx) => (
                <Route
                    key={idx}
                    exact={com.exact}
                    path={com.path}
                    component={com.component}
                    {...com}
                />
            ))}
        </Switch>
    </Router>
)

export default App
