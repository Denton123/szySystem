import React, {Component} from 'react'
import {
    Input,
    Select,
    Table,
    Button
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

        const timeDate = {
            format: 'YYYY-MM-DD',
        }

        const condition = [
            {
                label: '用户',
                field: 'realname',
                component: (<Input autoComplete="off" placeholder="用户" />)
            },
            {
                label: '类型',
                field: 'type',
                component: (
                    <Select
                        style={{width: 150}}
                        placeholder="请选择类型"
                        allowClear
                    >
                        <Option value="1">新增</Option>
                        <Option value="2">修改</Option>
                        <Option value="3">删除</Option>
                    </Select>
                )
            },
            {
                label: '时间',
                field: 'time',
                component: <CustomRangePicker {...timeDate} />,
            },
        ]

        // 表格
        const columns = [
            {
                title: '操作类型',
                dataIndex: 'type',
                key: 'type',
                width: 100
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
                dataIndex: 'time',
                key: 'time',
                width: 200
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={<Button style={{marginLeft: 50}} type="primary" htmlType="submit">查询</Button>}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
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
        email: {
            value: null
        },
        job: {
            value: null
        },
        entry_date: {
            value: null
        },
        quit_date: {
            value: null
        }
    },
})

export default OL
