import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank
} from 'antd-mobile'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

class WorkLog extends React.Component {
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
        ]

        return (
            <div style={{ backgroundColor: '#fff', paddingBottom: '15px' }}>
                <CompanyDetailPageModel {...this.props}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Header
                                        title={obj.User.realname}
                                        thumb={<img style={{maxWidth: '64px', maxHeight: '64px'}} src={obj.User && obj.User.avatar ? `/uploadImgs/${obj.User.avatar}` : this.state.src} />} />
                                    <Card.Body>
                                        <div style={{textAlign: 'left'}}>{obj.content}</div>
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

export default withBasicDataModel(WorkLog, {
    model: 'worklog'
})
