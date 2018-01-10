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
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, show} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class SummaryDetail extends Component {
    state = {
        data: {},
    }
    componentDidMount() {
        this.getData()
    }
    getData = () => {
        show(`summary/${this.props.match.params.id}`)
            .then(res => {
                if (Object.keys(res.data).length === 0) {
                    this.props.history.push('/home/404')
                } else {
                    this.setState({
                        data: res.data
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    goBack = (e) => {
        this.props.history.goBack()
    }

    goEdit = (e) => {
        this.props.history.push(`/home/personal/summary/edit/${this.props.match.params.id}`)
    }
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props
        const data = this.state.data
        console.log(this.props)
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Card
                    title={
                        <div>
                            <h1>{data.title}</h1>
                            <p>
                                <span className="mr-10">作者：{data.User ? data.User.realname : null}</span>
                                <span className="mr-10">发表时间：{data.date}</span>
                            </p>
                        </div>
                    }
                    extra={
                        <div>
                            <Button className="pull-right" type="primary" onClick={this.goBack}>返回</Button>
                            <Button className="pull-right mr-10" type="primary" onClick={this.goEdit}>编辑</Button>
                        </div>
                    }
                >
                    <div dangerouslySetInnerHTML={{__html: data.content}} />
                </Card>
            </div>
        )
    }
}

export default SummaryDetail
