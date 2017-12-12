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
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import Stage from './ProjectStage.js'

const {Meta} = Card

class ProjectDetail extends Component {
    state = {
        projectData: {},
        loading: true
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
        let id = this.props.match.params.id
        show(`project/${id}`)
            .then(res => {
                this.setState({
                    projectData: resetObject(res.data),
                    loading: false
                })
            })
    }
    goBack = (e) => {
        this.props.history.goBack()
    }
    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props
        const {projectData, loading} = this.state
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
                <Stage id={projectData.id} />
            </div>
        )
    }
}

const PD = withBasicDataModel(ProjectDetail, {
    model: 'project',
    formFieldsValues: {
        id: {
            value: null
        },
        user_id: {
            value: null
        },
        name: {
            value: null
        },
        img: {
            value: null
        },
        introduce: {
            value: null
        },
        plan_start_date: {
            value: null
        },
        plan_end_date: {
            value: null
        },
    },
    handleTableData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    },
    customGetData: true
})

export default PD
