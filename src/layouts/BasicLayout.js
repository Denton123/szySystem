/**
 * 整体页面架构
 * @description
 * @author 吴燕萍
 * @date 2017/11/22
 */
import styles from './BasicLayout.less'
import React from 'react'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'

import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

// 子路由
function SubRoute({route, idx, match}) {
    return (
        <Switch>
            {
                route.routes.map((child, sn) => (
                    <Route
                        key={`${idx}-${sn}`}
                        exact={child.exact}
                        path={`${match.path}${route.path}${child.path}`}
                        render={props => (
                            <Content style={{ margin: '0 16px' }}>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                                    <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                                </Breadcrumb>
                                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                    <child.component />
                                </div>
                            </Content>
                        )} />
                ))
            }
        </Switch>
    )
}

class BasicLayout extends React.Component {
    state = {
        collapsed: false
    }
    onCollapse = (collapsed) => {
        console.log(collapsed)
        this.setState({ collapsed })
    }
    render() {
        const routes = this.props.routes
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        const dynamicSider = (
            <div>
                <div className="logo" />
                <Menu theme="dark" mode="inline">
                    {routes.map((route, idx) => {
                        if (route.routes) {
                            return (
                                <SubMenu
                                    key={idx}
                                    title={<span><Icon type="user" /><span>{route.name}</span></span>}
                                >
                                    {
                                        route.routes.map((child, sn) => (
                                            <Menu.Item key={`${idx}-${sn}`}>
                                                <Link to={`${match.path}${route.path}${child.path}`}>{child.name}</Link>
                                            </Menu.Item>
                                        ))
                                    }
                                </SubMenu>
                            )
                        } else {
                            return (
                                <Menu.Item key={idx}>
                                    <Icon type="pie-chart" />
                                    <span><Link to={`${match.path}${route.path}`}>{route.name}</Link></span>
                                </Menu.Item>
                            )
                        }
                    })}
                </Menu>
            </div>
        )

        const dynamicLayout = (
            <div>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Route exact path={match.path} render={() => (
                    <Redirect to={`${match.path}/default`} />
                )} />
                {
                    routes.map((route, idx) => {
                        if (route.routes) {
                            return (
                                <SubRoute key={idx} route={route} idx={idx} match={match} />
                            )
                        } else {
                            return (
                                <Route
                                    key={idx}
                                    exact
                                    path={`${match.path}${route.path}`}
                                    render={props => (
                                        <Content style={{ margin: '0 16px' }}>
                                            <Breadcrumb style={{ margin: '16px 0' }}>
                                                <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                                            </Breadcrumb>
                                            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                                                <route.component />
                                            </div>
                                        </Content>
                                    )} />
                            )
                        }
                    })
                }
                <Footer style={{ textAlign: 'center' }}>
                    szy公司系统 ©2017 Created by szy
                </Footer>
            </div>
        )

        const sider = (
            <div>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="pie-chart" />
                        <span>Option 1</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="desktop" />
                        <span>Option 2</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={<span><Icon type="user" /><span>User</span></span>}
                    >
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={<span><Icon type="team" /><span>Team</span></span>}
                    >
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9">
                        <Icon type="file" />
                        <span>File</span>
                    </Menu.Item>
                </Menu>
            </div>
        )

        const layout = (
            <div>
                <Header style={{ background: '#fff', padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        Bill is a cat.
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    szy公司系统 ©2017 Created by szy
                </Footer>
            </div>
        )

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    {dynamicSider}
                </Sider>
                <Layout>
                    {dynamicLayout}
                </Layout>
            </Layout>
        )
    }
}

export default BasicLayout
