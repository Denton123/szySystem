import React from 'react'
import {
    List,
    InputItem,
    Accordion,
    WhiteSpace,
    WingBlank
} from 'antd-mobile'

import withBasicDataModel from '../withBasicDataModel'
import CompanyDetailPageModel from '../CompanyDetailPageModel'
import NoData from '../NoData'

const Item = List.Item
const Brief = Item.Brief

module.exports = function(opts) {
    class Asset extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
            }
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

            let condition = [
                ({getFieldProps}) => {
                    return (
                        <InputItem
                            {...getFieldProps('name')}
                            title="名称"
                            placeholder="名称">
                            名称
                        </InputItem>
                    )
                }
            ]

            return (
                <div style={{ height: '100%' }}>
                    <CompanyDetailPageModel {...this.props} condition={condition}>
                        {
                            (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                                <div key={i.toString()}>
                                    <WhiteSpace size="sm" />
                                    <Accordion className="my-accordion">
                                        <Accordion.Panel header={<List.Item multipleLine extra={obj.createdAt}>{obj.name}</List.Item>}>
                                            <List className="my-list">
                                                <List.Item multipleLine extra={obj.price}>单价</List.Item>
                                                <List.Item multipleLine extra={obj.number}>数量</List.Item>
                                                <List.Item multipleLine extra={obj.purchase}>购买人</List.Item>
                                            </List>
                                        </Accordion.Panel>
                                    </Accordion>
                                    <WhiteSpace size="sm" />
                                </div>
                            )) : <NoData />
                        }
                    </CompanyDetailPageModel>
                </div>
            )
        }
    }
    const As = withBasicDataModel(Asset, {
        model: 'asset',
        subModel: {
            belong: opts.belong
        }
    })
    return As
}
