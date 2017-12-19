import React, {Component} from 'react'
import {
    Input,
    Button,
    Card,
    Avatar
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

import './ProblemDetail.less'
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
                DetailData: resetObject(res.data)
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
            match,
            user
        } = this.props

        const formFields = [
            {
                label: '标题',
                field: 'title',
                component: (<Input autoComplete="off" placeholder="请输入标题" />)
            },
            {
                label: '内容',
                field: 'problem',
                formItemStyle: {
                    height: 350
                },
                component: (<ReactQuill placeholder="内容" style={{height: 250}} />)
            }
        ]
        return (
            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                <Card
                    title={DetailData.title}
                    extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                >
                    <p className="Problem">{DetailData.problem}</p>
                    {
                        user && user.id === DetailData.user_id ? <Button type="primary" data-id={DetailData.id} onClick={this.props.handleEdit}>编辑</Button> : null
                    }
                    <div className="msg">
                        <span>{`提问者：${DetailData.realname}`}</span>
                        <span>{`提问时间：${DetailData.createdAt}`}</span>
                    </div>
                    <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel}>
                        <CustomForm
                            formStyle={{width: '100%'}}
                            formFields={formFields}
                            handleSubmit={this.props.handleFormSubmit}
                            updateFormFields={this.props.updateFormFields}
                            formFieldsValues={this.props.formFieldsValues}
                            isSubmitting={this.props.isSubmitting}
                        />
                    </CustomModal>
                </Card>
            </div>
        )
    }
}

const PE = withBasicDataModel(ProblemDetail, {
    model: 'problem',
    formFieldsValues: {
        id: {
            value: null
        },
        title: {
            value: null
        },
        problem: {
            value: null
        }
    }
})

export default PE
