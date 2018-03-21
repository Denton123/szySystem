import React from 'react'
import {
    Grid,
    Icon,
    Card,
    Tabs,
    WhiteSpace,
    Badge,
    Pagination,
    List
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

const Item = List.Item
const Brief = Item.Brief

class Contract extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            total: 0,
            model: 'contract'
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
                <List className="my-list">
                    {
                        this.state.data.length > 0 ? this.state.data.map((obj, i) => (
                            <Item extra={obj.createdAt} key={i}>{obj.user.realname}</Item>
                        )) : <p className="pt10">暂无数据</p>
                    }
                </List>
                <Pagination total={this.state.total} current={1} locale={locale} onChange={this.handleChangePage} />
            </div>
        )
    }
}

export default Contract
