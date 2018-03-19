import './mobileBasicLayout.less'
import React from 'react'
import {
    Menu,
    ActivityIndicator,
    NavBar
} from 'antd-mobile'

const data = [
    {
        value: '1',
        label: 'Food',
        children: [
            {
                label: 'All Foods',
                value: '1',
                disabled: false,
            },
            {
                label: 'Chinese Food',
                value: '2',
            }, {
                label: 'Hot Pot',
                value: '3',
            }, {
                label: 'Buffet',
                value: '4',
            }, {
                label: 'Fast Food',
                value: '5',
            }, {
                label: 'Snack',
                value: '6',
            }, {
                label: 'Bread',
                value: '7',
            }, {
                label: 'Fruit',
                value: '8',
            }, {
                label: 'Noodle',
                value: '9',
            }, {
                label: 'Leisure Food',
                value: '10'
            }
        ]
    }, {
        value: '2',
        label: 'Supermarket',
        children: [
            {
                label: 'All Supermarkets',
                value: '1',
            }, {
                label: 'Supermarket',
                value: '2',
                disabled: true,
            }, {
                label: 'C-Store',
                value: '3',
            }, {
                label: 'Personal Care',
                value: '4'
            }
        ]
    },
    {
        value: '3',
        label: 'Extra',
        isLeaf: true,
        children: [
            {
                label: 'you can not see',
                value: '1'
            }
        ]
    }
]

// 重整路由结构
function resetRoute(routes) {
    console.log(routes)
    let arr = []
    routes.forEach(r => {
        let obj = {}
        if (r.routes) {
            r.routes.forEach(rc => {
                if (rc.routes) {
                    let children = []
                    rc.routes.forEach(rcc => {
                        obj = {
                            component: rcc.component,
                            name: `${r.name},${rc.name},${rcc.name}`,
                            path: `${r.path}${rc.path}${rcc.path}`
                        }
                        children.push(obj)
                    })
                    arr.push(children)
                }
                obj = {
                    component: rc.component,
                    name: `${r.name},${rc.name}`,
                    path: `${r.path}${rc.path}`
                }
                arr.push(obj)
            })
        } else {
            obj = {
                component: r.component,
                name: r.name,
                path: r.path
            }
            arr.push(obj)
            if (r.path === '/404' || r.path === '/no-permission') { // 404和无权限页面默认加入
                arr.push(obj)
            }
        }
    })
    return arr
}

class MobileBasicLayout extends React.Component {
    constructor(...args) {
        super(...args)
        this.state = {
            initData: '',
            show: false,
            title: ''
        }
    }
    onChange = (value) => {
        let label = ''
        data.forEach((dataItem) => {
            if (dataItem.value === value[0]) {
                label = dataItem.label
                if (dataItem.children && value[1]) {
                    dataItem.children.forEach((cItem) => {
                        if (cItem.value === value[1]) {
                            label += ` ${cItem.label}`
                        }
                    })
                }
            }
        })
        console.log(label)
        this.setState({
            title: label
        })
    }
    handleClick = (e) => {
        e.preventDefault() // Fix event propagation on Android
        this.setState({
            show: !this.state.show
        })
        // mock for async data loading
        if (!this.state.initData) {
            setTimeout(() => {
                this.setState({
                    initData: data
                })
            }, 500)
        }
    }

    onMaskClick = () => {
        this.setState({
            show: false
        })
    }

    render() {
        const {
            initData,
            show,
            title
        } = this.state
        const {
            routes,
            history,
            location,
            match,
            user,
            collapsed,
            permissionRoutes
        } = this.props
        const newRoutes = resetRoute(permissionRoutes)

        const menuEl = (
            <Menu
                className="foo-menu"
                data={initData}
                value={['1', '3']}
                onChange={this.onChange}
                height={document.documentElement.clientHeight * 0.6}
            />
        )
        const loadingEl = (
            <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </div>
        )
        return (
            <div className="BasicLayout">
                <div className={show ? 'menu-active' : ''}>
                    <div>
                        <NavBar
                            leftContent="Menu"
                            mode="light"
                            icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/iXVHARNNlmdCGnwWxQPH.svg" className="am-icon am-icon-md" alt="" />}
                            onLeftClick={this.handleClick}
                            className="top-nav-bar"
                        >
                            {title}
                        </NavBar>
                    </div>
                    {show ? initData ? menuEl : loadingEl : null}
                    {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
                </div>
            </div>
        )
    }
}
export default MobileBasicLayout
