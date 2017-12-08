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
import {isObject, isArray, valueToMoment, resetObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class SummaryDetail extends Component {
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        console.log(match)

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                SummaryDetail
            </div>
        )
    }
}

export default SummaryDetail
