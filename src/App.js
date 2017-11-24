import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'

import routes from 'ROUTES'

// 判断是否登录
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
