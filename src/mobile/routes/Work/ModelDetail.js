import React from 'react'
import {
    Link,
} from 'react-router-dom'

function getRoutes(path) {
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`.${route}`).default
}

const names = {
    add: '发表总结',
    edit: '编辑总结',
    normal: '普通任务',
    project: '项目任务',
    tDetail: '任务详情',
}

class Model extends React.Component {
    componentWillMount() {
        let searchArr = this.props.location.search.substr(1).split('&'),
            urlSearch = {}
        searchArr.forEach(sa => {
            let arr = sa.split('=')
            urlSearch[arr[0]] = arr[1]
        })
        this.props.setCustomNavBarState(names[urlSearch['_type']], 'back')
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.location.search !== nextProps.location.search) {
            let searchArr = nextProps.location.search.substr(1).split('&'),
                urlSearch = {}
            searchArr.forEach(sa => {
                let arr = sa.split('=')
                urlSearch[arr[0]] = arr[1]
            })
            this.props.setCustomNavBarState(names[urlSearch['_type']], 'back')
        }
    }
    render() {
        const {
            match,
        } = this.props
        const Content = getRoutes([match.params.model, match.params.detail])
        return (
            <Content {...this.props} />
        )
    }
}

export default Model
