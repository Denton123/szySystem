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
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const { Content } = Layout
const {TextArea} = Input

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

class Problem extends Component {
    componentDidMount() {
        let page = this.props.location.state ? this.props.location.state.page : 1
        this.props.getData({
            page: 1
        })
    }
    handleFormSubmit = (values) => {
        let params = {
            user_id: this.props.user.id
        }
        if (!this.props.match.params.id) {
            params['date'] = formatDate(true)
        }
        for (let i in values) {
            params[i] = values[i]
        }
        this.props.handleFormSubmit(params)
    }
    render() {
        const {
            child,
            route,
            history,
            location,
            match,
            user
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
                component: (<Input className="mb-10" autoComplete="off" placeholder="发布者" />)
            },
            {
                label: '关键字',
                field: 'keyword',
                component: (<Input className="mb-10" autoComplete="off" placeholder="关键字" />)
            },
            {
                label: '发布日期',
                field: 'date',
                component: <CustomRangePicker className="mb-10" showTime={false} format={'YYYY-MM-DD'} />
            }
        ]

        // 操作
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>
        ]

        const columns = [
            {
                title: '发布者',
                dataIndex: 'realname',
                key: 'realname'
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '是否解决',
                dataIndex: 'resolution',
                key: 'resolution',
                render: text => <span>{text === '1' ? '解决' : '未解决'}</span>
            },
            {
                title: '发表日期',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return (
                        <span>
                            <Link to={`${match.url}/${text.id}`}>查看</Link>
                            {
                                user && text.user_id === user.id
                                ? <span>
                                    <Divider type="vertical" />
                                    <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
                                </span>
                                : null
                            }
                        </span>
                    )
                }
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
                formItemStyle: {
                    height: 350
                },
                component: (<ReactQuill placeholder="内容" style={{height: 250}} />)
            }
        ]

        const tableExpandedRowRender = (record) => {
            let content = escape(record.problem)
            return (
                <div dangerouslySetInnerHTML={{__html: content}} />
            )
        }

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
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} expandedRowRender={tableExpandedRowRender} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.handleFormSubmit}
                        updateFormFields={this.props.updateFormFields}
                        formFieldsValues={this.props.formFieldsValues}
                        isSubmitting={this.props.isSubmitting}
                    />
                </CustomModal>
            </div>
        )
    }
}

const Pr = withBasicDataModel(Problem, {
    model: 'problem',
    title: '问题',
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
    handleData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    },
    customGetData: true
})
export default Pr
