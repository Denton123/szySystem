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

class Company extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // 页面获取的数据
            data: [],
            // tab的下标
            tabIndex: 1
        }
    }

    // thumb={obj && obj.avatar ? `/uploadImgs/${obj.avatar}` : '../../../assets/user.png'}
    // thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
    // <WorkerAffairs {...this.props} tab={tab} data={this.state.data} />
    renderContent = tab => {
        console.log('CompanyDetail.js')
        console.log(tab)
        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                <tab.component {...this.props} tab={tab} />
            </div>
        )
    }

    componentDidMount() {
    }

    getData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            axios.get(`/api/user?page=1`).then(res => {
                this.setState({
                    data: res.data.data
                })
            })
        }
    }

    handleTabClick = (tab, index) => {
        console.log(tab)
        this.setState({
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
        // props传过来的数据有时候会没有，之后才会有，异步，所以用的时候先判断一下
        if (permissionRoutes.length > 0) {
            let newRoutes = permissionRoutes.find(item => item.path === `/${match.params.model}`)
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
            <div>
                <Tabs
                    tabs={tabs}
                    page={this.state.tabIndex}
                    renderTabBar={props => tabRender(props)}
                    onTabClick={this.handleTabClick}>
                    {this.renderContent}
                </Tabs>
                <Route path={`${match.url}/:model`} component={Model} />
            </div>
        )
    }
}

export default Company
