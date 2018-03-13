import React, {Component} from 'react'
import {
    Input,
    Select,
    Table,
    Button
} from 'antd'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {Option} = Select

class OperateLog extends Component {
    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props

        const condition = [
            {
                label: '用户',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="用户" />)
                },
            },
            {
                label: '类型',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('type', {})(
                        <Select
                            className="mb-10"
                            style={{width: 150}}
                            placeholder="请选择类型"
                            allowClear
                        >
                            <Option value="0">新增</Option>
                            <Option value="1">删除</Option>
                            <Option value="2">修改</Option>
                            <Option value="3">查询</Option>
                            <Option value="4">查看</Option>
                            <Option value="5">登录</Option>
                            <Option value="6">登出</Option>
                        </Select>
                    )
                },
            },
            {
                label: '时间',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('log_date', {})(<CustomRangePicker className="mb-10" format={'YYYY-MM-DD'} />)
                },
            },
        ]

        const customFormOperation = [
            () => <Button style={{marginLeft: 50}} type="primary" htmlType="submit">查询</Button>,
            () => <Button className="mr-10" type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]

        // 表格
        const columns = [
            {
                title: '操作类型',
                dataIndex: 'type',
                key: 'type',
                width: 100,
                render: (text, record) => {
                    const OPERATE = {
                        0: '新增',
                        1: '删除',
                        2: '修改',
                        3: '查询',
                        4: '查看',
                        5: '登录',
                        6: '登出',
                        7: '批量删除',
                        8: '关联',
                        9: '批量新增'
                    }
                    return <span>{OPERATE[text]}</span>
                }
            },
            {
                title: 'ip地址',
                dataIndex: 'ip',
                key: 'ip',
            },
            {
                title: '用户',
                dataIndex: 'realname',
                key: 'realname',
                width: 100
            },
            {
                title: '模块',
                dataIndex: 'model',
                key: 'model',
                width: 100
            },
            {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '时间',
                dataIndex: 'log_date',
                key: 'log_date',
                width: 200
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
                <Table className="mt-10" {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
            </div>
        )
    }
}

const OL = withBasicDataModel(OperateLog, {
    model: 'log',
    title: '操作日志',
    queryFieldValues: {
        realname: {
            value: null
        },
        type: {
            value: null
        },
        log_date: {
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
})

export default OL
