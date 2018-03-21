import React from 'react'
import {
    Icon,
    Card,
    Tabs,
    Pagination,
    List
} from 'antd-mobile'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

import withBasicDataModel from '../../../components/withBasicDataModel'

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
        }
    }

    componentWillMount() {
        console.log('Contract.js')
        this.props.getData()
    }

    handleChangePage = (e) => {
        console.log(e)
        let p = {
            page: e
        }
        if (this.props.location.state) {
            p = {
                ...p,
                ...this.props.location.state
            }
        }
        this.props.history.replace(`${this.props.location.pathname}`, p)
    }

    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes,
            dateSetting
        } = this.props

        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                <List className="my-list">
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <Item extra={obj.createdAt} key={i}>{obj.user.realname}</Item>
                        )) : <p className="pt10">暂无数据</p>
                    }
                </List>
                <Pagination total={dateSetting.pagination.total} current={dateSetting.pagination.current} locale={locale} onChange={this.handleChangePage} />
            </div>
        )
    }
}

export default withBasicDataModel(Contract, {
    model: 'contract'
})
