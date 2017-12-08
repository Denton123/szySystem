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
import {isObject, isArray, valueToMoment, resetObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class Summary extends Component {
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        const condition = [
            {
                label: '作者',
                field: 'realname',
                component: (<Input autoComplete="off" placeholder="作者" />)
            },
            {
                label: '关键字',
                field: 'keyword',
                component: (<Input autoComplete="off" placeholder="关键字" />)
            },
            {
                label: '发表日期',
                field: 'date',
                component: (<CustomDatePicker />)
            }
        ]
        const operationBtn = [
            () => (
                <Link to={`${match.url}/detail`}>
                    <Button type="primary">
                        发表总结
                    </Button>
                </Link>
            )
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
                key: 'title',
                width: 350,
            },
            {
                title: '上传日期',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id}>删除</a>
                    </span>
                )
            }
        ]

        const tableExpandedRowRender = (record) => {
            console.log(record)
            return (
                <p>a</p>
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
                <Table {...this.props.tableSetting} rowKey={record => record.id} columns={columns} expandedRowRender={tableExpandedRowRender} />
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
    },
    // handleTableData: (dataSource) => {
    //     let arr = []
    //     dataSource.forEach(data => {
    //         arr.push(resetObject(data))
    //     })
    //     return arr
    // }
})

export default Sy
