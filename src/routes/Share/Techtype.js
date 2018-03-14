import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider
} from 'antd'
import {
    Link,
} from 'react-router-dom'
import ReactQuill from 'react-quill'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, transformValue} from 'UTILS/utils'
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

class Technology extends Component {
    state = {
        types: [] // 全部类型
    }
    componentDidMount() {
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
                label: '分类',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('name', {})(<Input className="mb-10" autoComplete="off" placeholder="分类" />)
                },
            }
        ]
        const operationBtn = [
            () => (
                <Link to={`${match.url}/add`}>
                    <Button type="primary">
                        新增
                    </Button>
                </Link>
            ),
        ]

        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]
        const columns = [
            {
                title: '论坛分类',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    return (
                        <span>
                            <Link to={`${match.path}/edit/${text.id}`}>编辑</Link>
                            <Divider type="vertical" />
                            <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
                        </span>
                    )
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

const Th = withBasicDataModel(Technology, {
    model: 'technology',
    queryFieldValues: {
        name: {
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

export default Th
