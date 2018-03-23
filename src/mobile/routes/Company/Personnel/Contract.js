import React from 'react'
import {
    List,
    InputItem
} from 'antd-mobile'

import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

const Item = List.Item
const Brief = Item.Brief

class Contract extends React.Component {
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
                        {...getFieldProps('realname')}
                        title="姓名"
                        placeholder="姓名">
                        姓名
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
                                <Item multipleLine extra={obj.createdAt} key={i}>{obj.user.realname}</Item>
                            )) : <NoData />
                        }
                    </List>
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(Contract, {
    model: 'contract'
})
