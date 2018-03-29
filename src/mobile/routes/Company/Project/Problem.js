import React from 'react'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    Icon
} from 'antd-mobile'
import {
    Link,
} from 'react-router-dom'

import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

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

        console.log('Problem.js ---')
        console.log(this.props)
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
            <div style={{height: '100%'}}>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Header
                                        title={obj.User.realname}
                                        extra={<Link to={`${match.url}/problem/${obj.id}`} key={i}><Icon type="right" /></Link>} />
                                    <Card.Body>
                                        <div style={{textAlign: 'left'}}>
                                            <p className="ellipsis">问题: {obj.title}</p>
                                        </div>
                                    </Card.Body>
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

export default withBasicDataModel(problem, {
    model: 'problem'
})
