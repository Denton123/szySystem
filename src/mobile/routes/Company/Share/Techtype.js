import React from 'react'
import {
    List,
    InputItem,
    WingBlank,
    WhiteSpace
} from 'antd-mobile'

import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

const Item = List.Item
const Brief = Item.Brief

class Techtype extends React.Component {
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
                        title="技术分类"
                        placeholder="技术分类">
                        技术分类
                    </InputItem>
                )
            }
        ]

        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    <List className="my-list">
                        {
                            (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                                <WingBlank size="lg" key={i}>
                                    <Item multipleLine>{obj.name}</Item>
                                </WingBlank>
                            )) : <NoData />
                        }
                    </List>
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(Techtype, {
    model: 'techtype'
})
