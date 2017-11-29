import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    Redirect
} from 'react-router-dom'

import routes from 'ROUTES'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 判断用户是否登录
            // 设置为true的时候可以进入/home页面
            // 设置为null的时候可以进入/login页面
            // user: this.props.user || null
            user: true
        }
    }
    /**
     * [description] 更新当前用户信息
     * @Author              bwx
     * @DateTime 2017-11-24
     * @param    {Object}   user [当前最新的用户信息]
     */
    updateUser = (user) => {
        this.setState({
            user: user
        })
    }
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={() => (
                        this.state.user ? (
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
                                <com.component {...props} routes={com.routes} user={this.state.user} updateUser={this.updateUser} />
                            )} />
                    ))}
                </Switch>
            </Router>
        )
    }
}

export default App
