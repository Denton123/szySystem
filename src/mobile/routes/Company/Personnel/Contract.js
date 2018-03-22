import React from 'react'
import {
    Icon,
    Card,
    Tabs,
    Pagination,
    List,
    WingBlank
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
            <div>
                <List className="my-list">
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <Item extra={obj.createdAt} key={i}>{obj.user.realname}</Item>
                        )) : <p className="mt-10">暂无数据</p>
                    }
                </List>
                <WingBlank>
                    <Pagination
                        className="mt-10"
                        total={dateSetting.pagination.total}
                        current={dateSetting.pagination.current}
                        locale={locale}
                        onChange={this.props.handlePageChange} />
                </WingBlank>
            </div>
        )
    }
}

export default withBasicDataModel(Contract, {
    model: 'contract'
})
