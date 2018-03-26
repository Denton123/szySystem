import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    List
} from 'antd-mobile'
import {
    Link,
} from 'react-router-dom'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

class Summary extends React.Component {
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
                        {...getFieldProps('realname')}
                        title="作者"
                        placeholder="作者">
                        作者
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
                                <Link to={`${match.url}/${obj.id}`} key={i}>
                                    <List.Item key={i.toString()} multipleLine arrow="horizontal">
                                        <Card>
                                            <Card.Body>
                                                <div style={{textAlign: 'left'}}>标题: {obj.title}</div>
                                            </Card.Body>
                                            <Card.Footer style={{textAlign: 'left'}} content={`作者：${obj.User.realname}`} extra={`${obj.createdAt}`} />
                                        </Card>
                                    </List.Item>
                                </Link>
                            )) : <NoData />
                        }
                    </List>
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(Summary, {
    model: 'summary'
})
