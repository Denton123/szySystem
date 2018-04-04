import React from 'react'
import ReactDOM from 'react-dom'
import {
    Card,
    InputItem,
    WhiteSpace,
    WingBlank,
    Icon,
    Accordion
} from 'antd-mobile'
import {
    Link,
} from 'react-router-dom'
import './Summary.less'
import withBasicDataModel from '../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../components/CompanyDetailPageModel'
import NoData from '../../../components/NoData'

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

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
            <div style={{ height: '100%' }}>
                <CompanyDetailPageModel {...this.props} condition={condition}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Body>
                                        <Accordion>
                                            <Accordion.Panel header={obj.title} style={{textAlign: 'left'}}>
                                                <div style={{textAlign: 'left', paddingBottom: '5px'}} dangerouslySetInnerHTML={{__html: escape(obj.content)}} />
                                            </Accordion.Panel>
                                        </Accordion>
                                    </Card.Body>
                                    <Card.Footer style={{textAlign: 'left'}} content={`作者：${obj.User.realname}`} extra={`${obj.createdAt}`} />
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

export default withBasicDataModel(Summary, {
    model: 'summary'
})
