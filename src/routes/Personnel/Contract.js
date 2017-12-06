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
        title: '真实姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '上传日期',
        dataIndex: 'data',
        key: 'data'
    },
    {
        title: '操作',
        key: 'action',
        render: (text, record) => (
            <span>
                <a href="javascript:;">编辑</a>
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
                name: '真实姓名',
                component: () => <SearchInput />
            }
        ]
        const operationBtn = [
            () => <Button type="primary">搜索</Button>,
            () => <Button type="danger">新增</Button>
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
