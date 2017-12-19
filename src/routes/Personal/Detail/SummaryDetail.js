import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider,
    message
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

const {TextArea} = Input

class SummaryDetail extends Component {
    componentDidMount() {
        if (this.props.match.params.id) {
        // 编辑
            this.getData()
        } else {
        // 新增
            this.props.handleSetState('operationType', 'add')
        }
    }
    getData = () => {
        if (!this.props.user) {
            this.props.history.push('/login')
        }
        show(`summary/${this.props.match.params.id}`)
            .then(res => {
                // 直接更新内部表单数据
                this.props.updateEditFormFieldsValues(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    goBack = (e) => {
        this.props.history.goBack()
    }
    handleFormSubmit = (values) => {
        let params = {
            user_id: this.props.user.id,
        }
        if (!this.props.match.params.id) {
            params['date'] = formatDate(true)
        }
        for (let i in values) {
            params[i] = values[i]
        }
        this.props.handleFormSubmit(params, (res) => {
            if (res.status === 200) {
                message.success('保存成功')
                setTimeout(() => {
                    this.props.history.push('/home/personal/summary')
                }, 200)
            }
        })
    }
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        const operationBtn = [
            () => (
                <Button className="pull-right" type="primary" onClick={this.goBack}>
                    返回
                </Button>
            )
        ]

        const condition = [
            {
                label: '标题',
                field: 'title',
                component: (<Input autoComplete="off" placeholder="标题" />)
            },
            // {
            //     label: '内容',
            //     field: 'content',
            //     component: (<TextArea rows={20} autoComplete="off" placeholder="关键字" />)
            // },
            {
                label: '内容',
                field: 'content',
                formItemStyle: {
                    height: 350
                },
                component: (<ReactQuill placeholder="内容" style={{height: 300}} />)
            }
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <BasicOperation className="mt-10 mb-10 clearfix" operationBtns={operationBtn} />
                <CustomForm
                    formStyle={{width: '80%'}}
                    formFields={condition}
                    handleSubmit={this.handleFormSubmit}
                    updateFormFields={this.props.updateFormFields}
                    formFieldsValues={this.props.formFieldsValues}
                />
            </div>
        )
    }
}

const Sd = withBasicDataModel(SummaryDetail, {
    model: 'summary',
    formFieldsValues: {
        id: {
            value: null
        },
        title: {
            value: null
        },
        content: {
            value: null
        }
    },
    customGetData: true
})

export default Sd
