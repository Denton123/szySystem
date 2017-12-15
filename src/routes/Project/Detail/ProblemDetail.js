import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, show} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class ProblemDetail extends Component {
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props
        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
            hiwhgi
            </div>
        )
    }
}

const PE = withBasicDataModel(ProblemDetail, {
    model: 'problem'
})

export default PE
