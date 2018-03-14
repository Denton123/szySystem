// 人员管理
import React, {Component} from 'react'
import {
    Button,
    Table,
    Input,
    message,
    Divider,
} from 'antd'

// 引入工具方法
// import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'
import {checkFormField} from 'UTILS/regExp'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class Techtype extends Component {
    /**
     * [根据技术分类id获取技术文章的数量]
     * @Author   szh
     * @DateTime 2018-01-11
     * @param    {Number}    tid[用户id数组]
     * @return   {Function}      [promise对象]
     */
    getTechnologyCountByTechtypeId = (tid) => {
        return ajax('get', `/technology/${tid}/count`)
    }
    handleDelete = (e) => {
        e.persist()
        let tid = e.target.dataset['id']
        this.getTechnologyCountByTechtypeId(tid)
        .then(res => {
            if (res.data.count === 0) {
                this.props.handleDelete(e)
            } else {
                message.warning('已经有技术文章使用该分类了')
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
        const entryDate = {
            format: 'YYYY-MM-DD',
            showTime: false,
            style: {
                width: 220
            }
        }
        const quitDate = {
            format: 'YYYY-MM-DD',
            showTime: false,
            style: {
                width: 220
            }
        }
        const condition = [
            {
                label: '技术分类',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('name', {})(<Input className="mb-10" autoComplete="off" placeholder="姓名" />)
                },
            },
        ]
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>,
            // () => <Button type="danger" onClick={this.handleBatchDelete}>删除</Button>
        ]
        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]

        // 表格
        const columns = [
            {
                title: '技术分类',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleEdit}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                    </span>
                )
            }
        ]

        // 表单
        const formFields = [
            {
                label: '技术分类',
                content: ({getFieldDecorator, getFieldValue}) => {
                    let id = 0
                    if (this.props.formFieldsValues.id.value) {
                        id = this.props.formFieldsValues.id.value
                    }
                    const validator = (rule, value, callback) => {
                        checkFormField(rule.field, value, 'Techtype', '技术分类', id)
                        .then(res => {
                            callback(res)
                        })
                    }
                    return getFieldDecorator('name', {
                        validateTrigger: ['onBlur'],
                        rules: [{required: true, validator: validator}]
                    })(<Input autoComplete="off" placeholder="技术分类" />)
                },
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={customFormOperation}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
                <CustomModal user={this.props.user} {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.props.handleFormSubmit}
                        updateFormFields={this.props.updateFormFields}
                        formFieldsValues={this.props.formFieldsValues}
                        isSubmitting={this.props.isSubmitting}
                    />
                </CustomModal>
            </div>
        )
    }
}

const TT = withBasicDataModel(Techtype, {
    model: 'techtype',
    title: '技术分类',
    queryFieldValues: {
        name: {
            value: null
        },
    },
    formFieldsValues: {
        id: {
            value: null
        },
        name: {
            value: null
        },
    },
})

export default TT
