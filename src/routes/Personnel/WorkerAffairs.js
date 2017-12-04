// 人员管理
import React, {Component} from 'react'
import { Icon, Button, Table, Avatar, DatePicker, Input, Radio } from 'antd'
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
import CustomPrompt from 'COMPONENTS/modal/CustomPrompt'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
const RadioGroup = Radio.Group

class WorkerAffairs extends Component {
    state = {
        entryDateValue: null,
        quitDateValue: null,
        tableSetting: {
            loading: true,
            pagination: false,
            dataSource: []
        },
        modalSetting: {
            title: '人员信息修改',
            confirmLoading: false,
            visible: false
        },
        formFieldsValues: {
            id: {
                value: null
            },
            name: {
                value: null
            },
            realname: {
                value: 'tests'
            },
            gender: {
                value: null
            },
            email: {
                value: null
            },
            phone: {
                value: null
            },
            birth_date: {
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

    // 表格翻页
    handlePageChange = (page) => {
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

    // 新增
    addTableItem = (e) => {
        this.setState({
            modalSetting: {
                visible: true
            }
        })
    }

    editTableItem = (e) => {
        let id = e.target.dataset['id']
        axios.get(`/api/user/${id}`)
            .then(res => {
                console.log(res)
                Object.keys(res.data).forEach(field => {
                    this.setState({
                        formFields: {
                            [field]: res.data[field]
                        }
                    })
                })
                this.setState({
                    modalSetting: {
                        visible: true
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    deleteTableItem = (e) => {
        let id = e.target.dataset['id']
        CustomPrompt({
            type: 'confirm',
            content: <div>是否要删除这条信息</div>,
            okType: 'danger',
            onOk: () => {
                axios.delete(`/api/user/${id}`)
                    .then(res => {
                        console.log(res)
                        let { dataSource } = this.state.tableSetting
                        dataSource.splice(
                            dataSource.findIndex(item => item.id === res.data.id),
                            1
                        )
                        this.setState({
                            tableSetting: {
                                dataSource: dataSource
                            }
                        })
                    })
                    .catch(err => {
                        console.dir(err)
                    })
            }
        })
    }

    handleFormSubmit = (values) => {
        console.log('----------------------------')
        console.log('parent `s :', values)
    }

    handleModalOk = (e) => {
        console.log(e)
        console.log('ok')
    }

    handleModalCancel = (e) => {
        this.setState({
            modalSetting: {
                visible: false
            }
        })
    }

    updateFormFields = (changedFields) => {
        console.log(changedFields)
        this.setState({
            formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
        })
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
                component: () => <CustomRangePicker {...entryDate} />
            },
            {
                name: '离职时间',
                component: () => <CustomRangePicker {...quitDate} />
            }
        ]
        const operationBtn = [
            () => <Button type="primary" onClick={this.addTableItem}>新增</Button>,
            () => <Button type="danger">删除</Button>
        ]

        // 表格
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
                        <a href="javascript:;" data-id={text.id} onClick={this.editTableItem}>编辑</a>
                        <span className="ant-divider" />
                        <a href="javascript:;" data-id={text.id} onClick={this.deleteTableItem}>删除</a>
                    </span>
                )
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
            }
        }
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

        // 表单
        const formFields = [
            {
                label: '姓名',
                field: 'realname',
                valid: {
                    rules: [{required: true, message: '请输入姓名'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="姓名" />),
                value: null
            },
            {
                label: '性别',
                field: 'gender',
                valid: {
                    rules: [{required: true, message: '请选择性别'}]
                },
                component: (
                    <RadioGroup>
                        <Radio value="male">男</Radio>
                        <Radio value="female">女</Radio>
                    </RadioGroup>
                )
            },
            {
                label: '邮箱',
                field: 'email',
                valid: {
                    rules: [{
                        type: 'email', message: '邮箱格式不对'
                    }, {
                        required: true, message: '请输入邮箱'
                    }]
                },
                component: (<Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="邮箱" />)
            },
            {
                label: '电话',
                field: 'phone',
                valid: {
                    rules: [{ required: true, message: '请输入你的电话' }]
                },
                component: (<Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="电话" />)
            },
            {
                label: '出生日期',
                field: 'birth_date',
                valid: {
                    rules: [{required: true, message: '请选择出生日期'}]
                },
                component: <DatePicker />
            },
            {
                label: '职位',
                field: 'job',
                valid: {
                    rules: [{required: true, message: '请输入职位'}]
                },
                component: (<Input placeholder="职位" />)
            },
            {
                label: '入职日期',
                field: 'entry_date',
                valid: {
                    rules: [{required: true, message: '请选择入职日期'}]
                },
                component: <DatePicker />
            },
            {
                label: '离职日期',
                field: 'quit_date',
                valid: {
                    rules: [{required: true, message: '请选择离职日期'}]
                },
                component: <DatePicker />
            }
        ]
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <BasicCondition conditions={condition} />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...state.tableSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
                <CustomModal {...state.modalSetting} onOk={this.handleModalOk} onCancel={this.handleModalCancel}>
                    <CustomForm
                        formFields={formFields}
                        handleSubmit={this.handleFormSubmit}
                        updateFormFields={this.updateFormFields}
                        formFieldsValues={this.state.formFieldsValues}
                    />
                </CustomModal>
            </div>
        )
    }
}

export default WorkerAffairs
