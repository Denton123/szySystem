/**
 * 整体页面架构
 * @description
 * @author 吴燕萍
 * @date 2017/11/22
 */
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch
} from 'react-router-dom'
import styles from './BasicLayout.less'
import React from 'react'
import { Layout, Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const { Header, Footer, Sider, Content } = Layout

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
class BasicLayout extends React.Component {
    // state = {
    //     collapsed: false
    // };
    // toggle = () => {
    //     this.setState({
    //         collapsed: !this.state.collapsed
    //     })
    // }
    // onOpenChange = (openKeys) => {
    //     const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    //     if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //         this.setState({ openKeys })
    //     } else {
    //         this.setState({
    //             openKeys: latestOpenKey ? [latestOpenKey] : []
    //         })
    //     }
    // }
    render() {
        // const sider = (
        //     <Menu
        //         mode="inline"
        //         openKeys={this.state.openKeys}
        //         onOpenChange={this.onOpenChange}
        //         style={{ width: 200 }}
        //         >
        //         <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
        //             <Menu.Item key="1">Option 1</Menu.Item>
        //             <Menu.Item key="2">Option 2</Menu.Item>
        //             <Menu.Item key="3">Option 3</Menu.Item>
        //         </SubMenu>
        //     </Menu>
        // )
        return (
            <div className="BasicLayout">
                <Layout>
                    <Sider>sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content>Content</Content>
                        <Footer>Footer</Footer>
                        {routes.map((route, i) => (
                            <RouteWithSubRoutes key={i} {...route} />
                      ))}
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default BasicLayout
