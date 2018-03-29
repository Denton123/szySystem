import React from 'react'
import {
    Grid,
    Icon,
    Card,
    Tabs,
    WhiteSpace,
    Badge,
    Pagination
} from 'antd-mobile'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

function Model() {
    return <div>div</div>
}

function getRoutes(path) {
    if (path === null) {
        return null
    } else {
        path = path.split(',')
    }
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`.${route}`).default
}

function getView(path, props) {
    let Com = require(`./${path}`).default
    return <Com {...props} />
}

class Company extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 页面获取的数据
            data: [],
            // tab的下标
            tabIndex: 0
        }
    }

    renderContent = tab => {
        return (
            <div style={{ height: '100%' }}>
                <tab.component {...this.props} tab={tab} />
            </div>
        )
    }

    componentWillMount() {
        let tabIndex = this.props.location.state && this.props.location.state.tabIndex ? this.props.location.state.tabIndex : 0
        this.setState({
            tabIndex: tabIndex
        })
    }

    handleTabClick = (tab, index) => {
        this.setState({
            tabIndex: index
        })
        this.props.history.replace(`${this.props.location.pathname}`, {
            tabIndex: index
        })
    }

    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes
        } = this.props

        let tabs = []
        let newRoutes = {}
        // props传过来的数据有时候会没有，之后才会有，异步，所以用的时候先判断一下
        if (permissionRoutes.length > 0) {
            newRoutes = permissionRoutes.find(item => item.path === `/${match.params.model}`)
            if (newRoutes.routes && isArray(newRoutes.routes)) {
                tabs = newRoutes.routes.map(rItem => {
                    let obj = {}
                    Object.keys(rItem).forEach(key => {
                        if (key === 'name') {
                            obj['title'] = rItem[key]
                            obj['name'] = rItem[key]
                        } else if (key === 'component') {
                            obj[key] = getRoutes(rItem[key])
                        } else {
                            obj[key] = rItem[key]
                        }
                    })
                    return obj
                })
            }
        }
        function tabRender(props) {
            return (
                <Tabs.DefaultTabBar {...props} page={3} />
            )
        }

        return (
            <div style={{height: '100%'}}>
                {
                    tabs.length > 0 ? (
                        <Tabs
                            tabs={tabs}
                            page={this.state.tabIndex}
                            renderTabBar={props => tabRender(props)}
                            onTabClick={this.handleTabClick}
                            onChange={this.handleTabClick}
                            prerenderingSiblingsNumber={0}
                            animated={false}>
                            {this.renderContent}
                        </Tabs>
                    ) : (Object.keys(newRoutes).length > 0 && getView(newRoutes.component, this.props))
                }
            </div>
        )
    }
}
export default Company
