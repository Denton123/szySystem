import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, transformValue, siderKeysUrl} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

/**
 * [escape 过滤script标签]
 * @DateTime 2017-12-11
 * @param    {string}   str [html标签字符串]
 * @return   {string}       [过滤后的html标签字符串]
 */
function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = function(opts) {
    class Summary extends Component {
        componentDidMount() {
            let keysObj = siderKeysUrl(this.props.location.pathname)
            this.props.BLhandleLinkClick(keysObj.openKeys, keysObj.selectedKeys)

            // let page = this.props.location.state ? this.props.location.state.page : 1
            let p = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}

            let obj = Object.assign({}, this.props.queryFieldValues)
            Object.keys(this.props.queryFieldValues).forEach(field => {
                if (p.hasOwnProperty(field)) {
                    obj[field] = {
                        value: transformValue(field, p[field])
                    }
                }
            })

            this.props.handleSetState('queryFieldValues', obj)

            if (opts.personal) {
                this.props.getData({
                    ...p,
                    user_id: this.props.user.id
                })
            } else {
                this.props.getData({
                    ...p,
                }, (data) => {
                    return ajax('get', '/summary/all', data)
                })
            }
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

            let condition = [
                {
                    label: '标题',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('title', {})(<Input className="mb-10" autoComplete="off" placeholder="标题" />)
                    },
                },
                {
                    label: '发表日期',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('date', {})(<CustomRangePicker className="mb-10" showTime={false} format={'YYYY-MM-DD'} />)
                    },
                }
            ]
            if (!opts.personal) {
                condition.unshift({
                    label: '作者',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="作者" />)
                    },
                })
            }
            const operationBtn = []
            if (opts.personal) {
                operationBtn.push(() => (
                    <Link to={`${match.url}/add`}>
                        <Button type="primary">
                            发表总结
                        </Button>
                    </Link>
                ))
            }
            const customFormOperation = [
                () => <Button type="primary" htmlType="submit">查询</Button>,
                () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
            ]
            const columns = [
                {
                    title: '作者',
                    dataIndex: 'realname',
                    key: 'realname',
                },
                {
                    title: '标题',
                    dataIndex: 'title',
                    key: 'title'
                },
                {
                    title: '发表时间',
                    dataIndex: 'date',
                    key: 'date',
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (text, record) => {
                        if (opts.personal) {
                            return (
                                <span>
                                    <Link to={`${match.path}/${text.id}`}>查看</Link>
                                    <Divider type="vertical" />
                                    <Link to={`${match.path}/edit/${text.id}`}>编辑</Link>
                                    <Divider type="vertical" />
                                    <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
                                </span>
                            )
                        } else {
                            return (
                                <span>
                                    <Link to={`/home/personal/summary/${text.id}`}>查看</Link>
                                </span>
                            )
                        }
                    }
                }
            ]

            const tableExpandedRowRender = (record) => {
                let content = escape(record.content)
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
                </div>
            )
        }
    }
    const Sy = withBasicDataModel(Summary, {
        model: 'summary',
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
        handleData: (dataSource) => {
            let arr = []
            dataSource.forEach(data => {
                arr.push(resetObject(data))
            })
            return arr
        },
        customGetData: true
    })
    return Sy
}
