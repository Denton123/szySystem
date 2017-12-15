import React, {Component} from 'react'
import {
    Input,
    Button,
    Card
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

const {Meta} = Card

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
class ProblemDetail extends Component {
    state = {
        DetailData: []
    }
    componentDidMount() {
        this.getData()
    }
    goBack = (e) => {
        this.props.history.goBack()
    }

    getData = () => {
        let id = this.props.match.params.id
        show(`problem/${id}`).then(res => {
            this.setState({
                DetailData: res.data
            })
        })
    }
    render() {
        const {DetailData} = this.state
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                <Card
                    title={DetailData.title}
                    extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                >
                    <div>{DetailData.problem}</div>
                    <span>{`提问时间：${DetailData.createdAt}`}</span>
                </Card>
            </div>
        )
    }
}

const PE = withBasicDataModel(ProblemDetail, {
    model: 'problem'
})

export default PE
