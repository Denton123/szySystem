import React, {Component} from 'react'
import { Layout, Breadcrumb, Icon, Button, Input, Table, Divider } from 'antd'
import {
    Link,
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
    // componentDidMount() {
    //     let page = this.props.location.state ? this.props.location.state.page : 1
    //     this.props.getData({
    //         page: 1
    //     })
    // }
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
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="发布者" />)
                },
            },
            {
                label: '标题',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('title', {})(<Input className="mb-10" autoComplete="off" placeholder="标题" />)
                },
            },
            {
                label: '发布日期',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('date', {})(<CustomRangePicker className="mb-10" showTime={false} format={'YYYY-MM-DD'} />)
                },
            }
        ]

        // 操作
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>
        ]

        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
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

        const formFields = [
            {
                label: '标题',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题'}]
                    })(<Input autoComplete="off" placeholder="请输入标题" />)
                },
            },
            {
                label: '内容',
                formItemStyle: {
                    height: 350
                },
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('problem', {
                        rules: [{required: true, message: '请输入内容'}]
                    })(<ReactQuill placeholder="内容" style={{height: 250}} />)
                },
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
                    customFormOperation={customFormOperation}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} expandedRowRender={tableExpandedRowRender} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} user={this.props.user}>
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
        title: {
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
    }
    // ,
    // customGetData: true
})
export default Pr
