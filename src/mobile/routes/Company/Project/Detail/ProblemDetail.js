import React from 'react'
import ReactDOM from 'react-dom'
import { WhiteSpace, WingBlank, Card, Icon } from 'antd-mobile'
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
            // getData方法的参数
            params: {
                state: {}  // getData第2个参数
            }
        }
    }

    componentWillMount() {
        console.log(this.props)
        let id = this.props.match.params.id
        this.setState(() => {
            return {
                params: {
                    state: {problem_id: id}
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

        return (
            <div style={{ height: '100%' }}>
                <CompanyDetailPageModel {...this.props} params={this.state.params}>
                    {
                        (dateSetting.dataSource && dateSetting.dataSource.length > 0) ? dateSetting.dataSource.map((obj, i) => (
                            <WingBlank key={i.toString()} size="lg">
                                <WhiteSpace size="sm" />
                                <Card>
                                    <Card.Body>
                                        { obj.used === '1' && <p style={{textAlign: 'left'}}><Icon color="#108ee9" type="check-circle" />已采纳</p> }
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
