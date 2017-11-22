import React from 'react'
// import {Button} from 'antd'
// import '../../style/css/main.css'
// class Sider extends Component {
//     render() {
//         return (
//             <Button type="primary">sider</Button>
//         )
//     }
// }

import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu

class Sider extends React.Component {
    // submenu keys of first level
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4']
    state = {
        openKeys: ['sub1']
    };
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys })
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            })
        }
    }
    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                style={{ width: 240 }}
                >
                <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                    <Menu.Item key="1">Option 1</Menu.Item>
                </SubMenu>
                
            </Menu>
        )
    }
}
// <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
//                     <Menu.Item key="5">Option 5</Menu.Item>
//                     <Menu.Item key="6">Option 6</Menu.Item>
//                     <SubMenu key="sub3" title="Submenu">
//                         <Menu.Item key="7">Option 7</Menu.Item>
//                         <Menu.Item key="8">Option 8</Menu.Item>
//                     </SubMenu>
//                 </SubMenu>
export default Sider
