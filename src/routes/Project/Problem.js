import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Input, Table, Divider } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const { Content } = Layout
const {TextArea} = Input

class Problem extends Component {
    render() {
        console.log(this.props)
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        // 时间
        const issueDate = {
            format: 'YYYY--MM-DD',
            showTime: false,
            style: {
                width: 220
            }
        }

        // 搜索操作
        const condition = [
            {
                label: '发布者',
                field: 'realname',
                component: (<Input autoComplete="off" placeholder="发布者" />)
            },
            {
                label: '关键字',
                field: 'content',
                component: (<Input autoComplete="off" placeholder="关键字" />)
            },
            {
                label: '发布日期',
                field: 'date',
                component: <CustomRangePicker {...issueDate} />
            }
        ]

        // 操作
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>,
            () => <Button type="danger" onClick={this.props.handleDelete}>删除</Button>
        ]

        const columns = [
            {
                title: '发布者',
                dataIndex: 'realname',
                key: 'realname',
                width: 70
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: 70
            },
            {
                title: '问题内容',
                dataIndex: 'problem',
                key: 'problem',
                width: 70
            },
            {
                title: '是否解决',
                dataIndex: 'resolution',
                key: 'resolution',
                width: 70,
                render: text => <span>{text === '0' ? '未解决' : '已解决'}</span>
            },
            {
                title: '发表日期',
                dataIndex: 'date',
                key: 'date',
                width: 70
            },
            {
                title: '操作',
                key: 'action',
                width: 100,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id}>查看</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={this.props.handleDelete}>删除</a>
                    </span>
                    )
            }
        ]

        // checkbox
        const rowSelection = {
            onChange: this.props.handleTableRowChange
        }

        const formFields = [
            {
                label: '标题',
                field: 'title',
                valid: {
                    rules: [{required: true, message: '请输入标题'}]
                },
                component: (<Input autoComplete="off" placeholder="请输入标题" />)
            },
            {
                label: '内容',
                field: 'problem',
                valid: {
                    rules: [{required: true, message: '请输入内容'}]
                },
                formItemStyle: {
                    height: 350
                },
                component: (<TextArea placeholder="内容" style={{height: 250}} />)
            }
        ]

        return (
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                    <Breadcrumb.Item>{child.name}</Breadcrumb.Item>
                </Breadcrumb>
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
            </Content>
        )
    }
}

const issue = withBasicDataModel(Problem, {
    model: 'problem',
    title: '问题',
    tableSetting: {},
    modalSetting: '项目问题',
    queryFieldValues: {
        realname: {
            value: null
        },
        problem: {
            value: null
        },
        date: {
            value: null
        }
    },
    formFieldsValues: {
        id: {
            value: null
        },
        realname: {
            value: null
        },
        problem: {
            value: null
        },
        date: {
            value: null
        }
    },
    handleTableData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    },
    customGetData: true
})
export default issue
