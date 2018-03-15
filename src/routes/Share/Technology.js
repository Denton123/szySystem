import React, {Component} from 'react'
import {
    Input,
    Button,
    Table,
    Divider,
    Select
} from 'antd'
import {
    Link,
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, transformValue} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const Option = Select.Option

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
        types: [] // 全部技术类型
    }
    componentDidMount() {
        this.getAllTechtype()
        let p = this.props.location.state && this.props.location.state.page ? this.props.location.state : {page: 1}
        this.props.getData({
            ...p,
        })
    }

    getAllTechtype() {
        ajax('get', '/techtype/all')
        .then(res => {
            this.setState({
                types: res.data
            })
        })
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
        const {
            types
        } = this.state
        let condition = [
            {
                label: '标题',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('title', {})(<Input className="mb-10" autoComplete="off" placeholder="标题" />)
                },
            },
            {
                label: '类型',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('type_id', {})(
                        <Select
                            style={{width: 120}}
                            placeholder="请选择类型"
                            allowClear
                        >
                            {types.map(type => (
                                <Option value={type.id} key={type.id}>{type.name}</Option>
                            ))}
                        </Select>
                    )
                },
            },
            {
                label: '作者',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="作者" />)
                },
            },
            {
                label: '发表日期',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('date', {})(<CustomRangePicker className="mb-10" showTime={false} format={'YYYY-MM-DD'} />)
                },
            },
        ]
        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]
        const operationBtn = [
            () => (
                <Link to={`${match.url}/add`}>
                    <Button type="primary">
                        发表
                    </Button>
                </Link>
            ),
        ]

        const columns = [
            {
                title: '作者',
                dataIndex: 'realname',
                key: 'realname',
            },
            {
                title: '类型',
                dataIndex: 'type_id',
                key: 'type_id',
                render: (text, record) => {
                    if (types.length > 0) {
                        return <span>{types.find(t => t.id === text).name}</span>
                    } else {
                        return <span />
                    }
                }
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
                    return (
                        <span>
                            <Link to={`${match.path}/${text.id}`}>查看</Link>
                            <Divider type="vertical" />
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

export default Th
