import React from 'react'
import {
    List,
    InputItem
} from 'antd-mobile'
import {
    Link,
} from 'react-router-dom'

import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

const Item = List.Item
const Brief = Item.Brief

class problem extends React.Component {
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
                        {...getFieldProps('title')}
                        title="标题"
                        placeholder="标题">
                        标题
                    </InputItem>
                )
            },
            ({getFieldProps}) => {
                return (
                    <InputItem
                        {...getFieldProps('realname')}
                        title="发布者"
                        placeholder="发布者">
                        发布者
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
                                <Link to={`${match.url}/${obj.id}`} key={i}><Item multipleLine arrow="horizontal" extra={obj.User.realname}>{obj.title}</Item></Link>
                            )) : <NoData />
                        }
                    </List>
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(problem, {
    model: 'problem'
})
