import React from 'react'
import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

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
const Cs = getRoutes('Project,Detail,ProjectDetail')
function getView(path) {
    let Com = require(`./${path}`).default
    return <Com />
}

class Work extends React.Component {
    componentWillMount() {
        this.props.setCustomNavBarState(this.props.CustomNavBarState.title, 'back')
    }
    componentWillUnmount(nextProps) {
        this.props.setCustomNavBarState(this.props.CustomNavBarState.title, 'menu')
    }
    goBack = (e) => {
        this.props.history.goBack()
    }
    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes
        } = this.props

        let newRoutes = {}
        // props传过来的数据有时候会没有，之后才会有，异步，所以用的时候先判断一下
        if (permissionRoutes.length > 0) {
            newRoutes = permissionRoutes.find(item => item.path === `/${match.params.model}`).routes.find(item => item.path === `/${match.params.detail}`)
        }
        let Detail = null
        if (newRoutes && Object.keys(newRoutes).length > 0) {
            Detail = getRoutes(newRoutes.routes[0].component)
        }
        // 特殊处理
        if (this.props.match.params.model === 'work' && this.props.match.params.detail === 'summary') {
            Detail = getRoutes('Work,Detail,SummaryDetail')
        }

        return (
            <div style={{ height: '100%' }}>
                {
                    Detail !== null && <Detail {...this.props} />
                }
            </div>
        )
    }
}
export default Work
