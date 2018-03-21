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

class WorkerAffairs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            total: 0,
            model: 'user'
        }
    }
    componentWillMount() {
        this.getData()
    }
    getData = () => {
        if (this.props.user) {
            const id = this.props.user.id
            let p = { page: 1 }
            index(this.state.model, p).then(res => {
                console.log(res)
                this.setState({
                    data: res.data.data,
                    total: res.data.totalPage
                })
            })
        }
    }
    handleChangePage = (e) => {
        console.log(e)
    }
    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes,
            tab
        } = this.props
        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                {
                    (this.state.data && this.state.data.length > 0) ? this.state.data.map((obj, i) => (
                        <Card key={i.toString()}>
                            <Card.Header
                                title={obj.realname}
                                thumb={<img style={{maxWidth: '64px', maxHeight: '64px'}} src={obj && obj.avatar ? `/uploadImgs/${obj.avatar}` : '../../../assets/user.png'} />}
                                extra={<span>{obj.job}</span>} />
                        </Card>
                    )) : <p className="pt10">暂无数据</p>
                }
                <Pagination total={this.state.total} current={1} locale={locale} onChange={this.handleChangePage} />
            </div>
        )
    }
}

export default WorkerAffairs
