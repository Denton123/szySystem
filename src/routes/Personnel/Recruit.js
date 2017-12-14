// 招聘管理
import React, {Component} from 'react'
import {
    Icon,
    Button,
    Table,
    Avatar,
    DatePicker,
    Input,
    Radio,
    message,
    Divider,
    Select
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const RadioGroup = Radio.Group

class Recruit extends Component {
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props
        console.log(this.props)
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

        // 条件
        const condition = [
            {
                label: '职位',
                field: 'job',
                component: (<Input autoComplete="off" placeholder="请输入职位" />)
            },
            {
                label: '面试时间',
                field: 'date',
                component: <CustomRangePicker {...entryDate} />
            }
        ]

        // 操作
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>
        ]

        // 表格
        const columns = [
            {
                title: '面试官',
                dataIndex: 'interviewer',
                key: 'interviewer'
            },
            {
                title: '面试者',
                dataIndex: 'interviewee',
                key: 'interviewee'
            },
            {
                title: '面试职位',
                dataIndex: 'job',
                key: 'job'
            },
            {
                title: '面试日期',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '评价',
                dataIndex: 'comment',
                key: 'comment'
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleComment}>评价</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handlePass}>是否通过</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handlePreview}>预览</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleDownload}>下载</a>
                    </span>
                )
            }
        ]

        const rowSelection = {
            onChange: this.props.handleTableRowChange
        }

        // 表单
        const formFields = [
            {
                label: '面试官',
                field: 'interviewer',
                valid: {
                    rules: [{required: true, message: '请输入面试官'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="面试官" />),
            },
            {
                label: '面试者',
                field: 'interviewee',
                valid: {
                    rules: [{required: true, message: '请输入面试者'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="面试者" />)
            },
            {
                label: '面试职位',
                field: 'jop',
                valid: {
                    rules: [{required: true, message: '请输入职位'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="面试职位" />)
            },
            {
                label: '面试日期',
                field: 'date',
                valid: {
                    rules: [{
                        required: true, message: '请输入面试日期'
                    }]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '简历',
                field: 'recruit',
                valid: {
                    rules: [{ required: true, message: '请上传简历' }]
                },
                component: (<Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="recruit" />)
            }
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={<Button type="primary" htmlType="submit">查询</Button>}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...this.props.tableSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
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
            </div>
        )
    }
}

const R = withBasicDataModel(Recruit, {
    model: 'user',
    title: '招聘管理',
    tableSetting: {
        rowSelection: {fixed: false}
    },
    modalSetting: {
        title: '招聘管理'
    },
    // 查询的
    queryFieldValues: {
        job: {
            value: null
        },
        date: {
            value: null
        },
    },
    // 表单的
    formFieldsValues: {
        interviewer: {
            value: null
        },
        interviewee: {
            value: null
        },
        jop: {
            value: null
        },
        date: {
            value: null
        },
        recruit: {
            value: null
        }
    }
})

export default R
