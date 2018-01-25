import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider,
    message
} from 'antd'
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
        const hide = message.loading('数据读取中', 0)
        show(`summary/${this.props.match.params.id}`)
            .then(res => {
                setTimeout(hide, 0)
                if (parseInt(res.data.id) === parseInt(this.props.match.params.id)) {
                    // 直接更新内部表单数据
                    this.props.updateEditFormFieldsValues(res.data)
                } else {
                    this.props.history.push('/home/404')
                }
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
            message.success('保存成功')
            setTimeout(() => {
                this.props.history.push('/home/personal/summary')
            }, 200)
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
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题'}]
                    })(<Input autoComplete="off" placeholder="标题" />)
                },
            },
            {
                label: '内容',
                formItemStyle: {
                    height: 350
                },
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('content', {
                        rules: [{required: true, message: '请输入内容'}]
                    })(<ReactQuill placeholder="内容" style={{height: 300}} />)
                },
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
