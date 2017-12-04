// 合同管理
import React, {Component} from 'react'
import { Icon, Button, Table, Avatar } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import BasicCondition from 'COMPONENTS/basic/BasicCondition'
import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import SearchInput from 'COMPONENTS/input/SearchInput'
// import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'

const columns = [
    {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
        width: 70
    },
    {
        title: '姓名',
        dataIndex: 'realname',
        key: 'realname',
        width: 70
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 50,
        render: text => <span>{text === 'male' ? '男' : '女'}</span>
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
    },
    {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
    },
    {
        title: '出生日期',
        dataIndex: 'birth_date',
        key: 'birth_date'
    },
    {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: text => <Avatar src={text} />
    },
    {
        title: '职位',
        dataIndex: 'job',
        key: 'job'
    },
    {
        title: '入职日期',
        dataIndex: 'entry_date',
        key: 'entry_date'
    },
    {
        title: '离职日期',
        dataIndex: 'quit_date',
        key: 'quit_date'
    },
    {
        title: '用户类型',
        dataIndex: 'type',
        key: 'type',
        render: text => <span>{text === '0' ? '最高级管理' : text === '1' ? '管理' : '普通用户'}</span>
    },
    {
        title: '操作',
        key: 'action',
        width: 200,
        render: (text, record) => (
            <span>
                <a href="javascript:;">编辑</a>
                <span className="ant-divider" />
                <a href="javascript:;">删除</a>
            </span>
        )
    }
]

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
    }
}

class Contract extends Component {
    state = {
        entryDateValue: null,
        quitDateValue: null,
        tableSetting: {
            loading: true,
            pagination: false,
            dataSource: []
        }
    }

    componentDidMount() {
        this.getData(1, true)
    }

    getData = (page, first = false) => {
        let data = {
            params: {
                page: page
            }
        }
        this.setState({
            tableSetting: {
                loading: true
            }
        })
        axios.get('/api/user', data)
            .then(res => {
                console.log(res)
                let paginationChange = {
                    onChange: this.handlePageChange
                }
                let pagination = {
                    defaultCurrent: res.data.currentPage,
                    pageSize: res.data.pageSize,
                    total: res.data.total
                }
                this.setState({
                    tableSetting: {
                        loading: false,
                        pagination: first ? Object.assign(pagination, paginationChange) : pagination,
                        dataSource: res.data.data
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handlePageChange = (page) => {
        console.log(page)
        this.getData(page)
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value
        })
    }

    onEntryDateChange = (value, valueString) => {
        this.onChange('entryDateValue', value)
        console.log('entryDateValue', valueString)
    }

    onQuitDateChange = (value, valueString) => {
        this.onChange('quitDateValue', value)
        console.log('quitDateValue', valueString)
    }

    onEntryDateOk = (value) => {
        console.log('onEntryDateOk: ', value)
    }

    onQuitDateOk = (value) => {
        console.log('onQuitDateOk: ', value)
    }

    render() {
        const child = this.props.child
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match
        const state = this.state

        const entryDate = {
            value: state.entryDateValue,
            format: 'YYYY-MM-DD',
            onChange: this.onEntryDateChange,
            onOk: this.onEntryDateOk
        }

        const quitDate = {
            value: state.quitDateValue,
            format: 'YYYY-MM-DD',
            onChange: this.onQuitDateChange,
            onOk: this.onQuitDateOk
        }

        const condition = [
            {
                name: '搜索',
                component: () => <SearchInput />
            },
            {
                name: '入职时间',
                component: () => <CustomRangePicker setting={entryDate} />
            },
            {
                name: '离职时间',
                component: () => <CustomRangePicker setting={quitDate} />
            }
        ]
        const operationBtn = [
            () => <Button type="primary">新增</Button>,
            () => <Button type="danger">删除</Button>
        ]
        // const tableSetting = {
        //     bordered: false,     // Boolean
        //     loading: false,      // Boolean
        //     pagination: {
        //         current: 1,
        //         pageSize: 10,
        //         total: 500
        //     },                   // Boolean || Object
        //     size: 'default',     // 'default', 'middle', 'small'
        //     expandedRowRender: record => <p>{record.description}</p>, // react组件函数   不显示时设置为undefined
        //     title: () => 'Here is title',    // react组件函数    不显示时设置为undefined
        //     showHeader: true,                // Boolean   表行头
        //     footer: () => 'Here is footer',  // react组件函数    不显示时设置为undefined
        //     rowSelection: {},                // checkbox         不显示时设置为undefined
        //     scroll: { y: 240 }               // 滑动             不显示时设置为undefined
        // }
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <BasicCondition conditions={condition} />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...state.tableSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
            </div>
        )
    }
}

export default Contract
