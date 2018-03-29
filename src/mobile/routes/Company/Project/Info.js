import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    List,
    Icon
} from 'antd-mobile'
import {
    Link,
} from 'react-router-dom'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

class Info extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            src: 'https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png'
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
                        title="项目名称"
                        placeholder="项目名称">
                        项目名称
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
                                        title={obj.name}
                                        thumb={<img style={{maxWidth: '64px', maxHeight: '64px'}} src={obj && obj.img ? `/uploadImgs/${obj.img}` : this.state.src} />}
                                        extra={<Link to={`${match.url}/info/${obj.id}`} key={i}><Icon type="right" /></Link>} />
                                    <Card.Body>
                                        <div style={{textAlign: 'left'}}>
                                            <p className="ellipsis">负责人: {obj.User.realname}</p>
                                            <p className="ellipsis">介绍: {obj.introduce}</p>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer style={{textAlign: 'left'}} content={`计划开始：${obj.plan_start_date}`} extra={`计划结束：${obj.plan_end_date}`} />
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

export default withBasicDataModel(Info, {
    model: 'project'
})
