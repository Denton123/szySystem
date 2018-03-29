import React from 'react'
import {
    InputItem,
    Card,
    WhiteSpace,
    WingBlank
} from 'antd-mobile'
import './Contract.less'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

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
            <div>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Header
                                        title={obj.user.realname}
                                        extra={obj.createdAt} />
                                </Card>
                                <WhiteSpace size="sm" />
                            </WingBlank>
                        )) : <NoData />
                    }
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(Contract, {
    model: 'contract'
})
