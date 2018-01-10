import React, {Component} from 'react'
import {
    Card,
    Button
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './ProjectDetail.less'

// 引入工具方法
import {getBase64, resetObject} from 'UTILS/utils'
import {ajax, show} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

// import Stage from './ProjectStage.js'

import Ts from 'COMPONENTS/page/Task'

const Task = Ts({
    total: false
})

const {Meta} = Card

class ProjectDetail extends Component {
    state = {
        projectData: {},
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
        let id = this.props.match.params.id
        this.props.handleSetState('loading', true)
        show(`project/${id}`)
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    this.props.history.push('/home/404')
                } else {
                    this.props.handleSetState('loading', false)
                    this.setState({
                        projectData: resetObject(res.data),
                    })
                }
            })
    }
    goBack = (e) => {
        // this.props.history.push('/home/project/info')
        this.props.history.goBack()
    }
    render() {
        const {
            route,
            history,
            location,
            match,
            user
        } = this.props
        const {projectData, loading} = this.state
        // <Stage id={match.params.id} user={user} route={route} history={history} location={location} match={match} />
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Card
                    loading={loading}
                    style={{ width: '100%' }}
                    title={projectData.name}
                    extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                >
                    <Meta
                        avatar={
                            <img width={272} height={155} alt="logo" src={`/uploadImgs/${projectData.img}`} />
                        }
                        title={
                            <div className="projectInfo-listItem-metaTitle">
                                <ul className="clearfix">
                                    <li className="pull-left">{`负责人：${projectData.realname}`}</li>
                                    <li className="pull-left">{`项目计划开始时间：${projectData.plan_start_date}`}</li>
                                    <li className="pull-left">{`项目计划结束时间：${projectData.plan_end_date}`}</li>
                                </ul>
                            </div>
                        }
                        description={
                            <div className="projectDetail-listItem-metaDesc">{projectData.introduce}</div>
                        }
                    />
                </Card>
                <Task project={projectData} user={user} route={route} history={history} location={location} match={match} />
            </div>
        )
    }
}

const PD = withBasicDataModel(ProjectDetail, {
    model: 'project',
    formFieldsValues: {
    },
    handleData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    },
    customGetData: true
})

export default PD
