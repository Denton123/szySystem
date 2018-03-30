import React from 'react'
import {
    List,
    InputItem,
    Accordion,
    WhiteSpace,
    WingBlank
} from 'antd-mobile'

import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

const Item = List.Item
const Brief = Item.Brief

class Recruit extends React.Component {
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
                        {...getFieldProps('job')}
                        title="面试职位"
                        placeholder="面试职位">
                        面试职位
                    </InputItem>
                )
            }
        ]

        return (
            <div>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <div key={i.toString()}>
                                <WhiteSpace size="sm" />
                                <Accordion className="my-accordion">
                                    <Accordion.Panel header={<List.Item multipleLine extra={obj.job}>{obj.interviewee}</List.Item>}>
                                        <List className="my-list">
                                            <List.Item multipleLine extra={obj.interviewer}>面试人</List.Item>
                                            <List.Item multipleLine extra={obj.createdAt}>面试时间</List.Item>
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

export default withBasicDataModel(Recruit, {
    model: 'recruit'
})
