import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout.js'

function getViews(model) {
    return require(`VIEWS/${model}`).default
}
const Check = ({ routes }) => (
    <div>
        <ul>
            <li><Link to="/personalAffairs/checkWork">Bus</Link></li>
            <li><Link to="/personalAffairs/dayLog">daylog</Link></li>
        </ul>

        {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
        ))}
    </div>
)
const CheckWork = () => <h3>CheckWork</h3>
const DayLog = () => <h3>DayLog</h3>

const routes = [
    {
        path: '/',
        exact: true,
        component: getViews('Home'),
        routes: [
            {
                name: '个人事务管理',
                path: '/personalAffairs',
                component: Check,
                routes: [
                    {
                        name: '考勤',
                        path: '/personalAffairs/checkWork',
                        component: CheckWork
                    },
                    {
                        name: '每日日志',
                        path: '/personalAffairs/dayLog',
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
const RouteWithSubRoutes = (route) => (
    <Route path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
        )} />
)
const Home = () => (
    <Router>
        <div>
            {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
        </div>
    </Router>
)

export default Home
