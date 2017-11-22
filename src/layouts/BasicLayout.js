/**
 * 整体页面架构
 * @description
 * @author 吴燕萍
 * @date 2017/11/22
 */
import styles from './BasicLayout.less'
import React from 'react'
import { Layout, Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
const { Header, Footer, Sider, Content } = Layout

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
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default BasicLayout
