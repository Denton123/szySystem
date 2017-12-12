import React, {Component} from 'react'
import {
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './ProjectDetail.less'

// 引入工具方法
import {resetObject} from 'UTILS/utils'
import {ajax, show} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class ProjectStage extends Component {
    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props
        console.log(this.props)
        return (
            <div>stage</div>
        )
    }
}

export default ProjectStage
