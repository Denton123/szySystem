import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    Accordion,
    Icon
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
            <div>
                <CompanyDetailPageModel {...this.props}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Body>
                                        <Accordion>
                                            <Accordion.Panel header={obj.User.realname} style={{textAlign: 'left'}}>
                                                <div style={{textAlign: 'left', paddingBottom: '10px', paddingTop: '10px'}} >{obj.content}</div>
                                            </Accordion.Panel>
                                        </Accordion>
                                    </Card.Body>
                                    <Card.Footer style={{textAlign: 'left'}} content={`${obj.createdAt}`} />
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
