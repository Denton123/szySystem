import React from 'react'
import ReactDOM from 'react-dom'
import { List, Picker, WhiteSpace, WingBlank, Accordion, Card } from 'antd-mobile'
import withBasicDataModel from '../../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../../components/CompanyDetailPageModel'
import NoData from '../../../../components/NoData'

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            params: {
                obj: {},
                arr: []
            }
        }
    }

    componentWillMount() {
        let id = this.props.match.params.id
        // this.props.getData({project_id: id})
        this.setState(() => {
            return {
                params: {
                    ...this.state.params,
                    obj: {problem_id: id}
                }
            }
        })
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
        console.log('ProjectDetail.js---')
        console.log(dateSetting)

        return (
            <div>
                <CompanyDetailPageModel {...this.props} params={this.state.params}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Body>
                                        <div style={{textAlign: 'left'}} dangerouslySetInnerHTML={{__html: escape(obj.answer)}} />
                                    </Card.Body>
                                    <Card.Footer style={{textAlign: 'left'}} content={`${obj.User.realname}`} extra={`${obj.date}`} />
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

export default withBasicDataModel(ProjectDetail, {
    model: 'answer'
})
