// 人员管理
import React, {Component} from 'react'
import {
    Icon,
    Button,
    Table,
    Avatar,
    DatePicker,
    Input,
    Radio,
    message,
    Divider,
    Select
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import moment from 'moment'

// 引入工具方法
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicCondition from 'COMPONENTS/basic/BasicCondition'
import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomPrompt from 'COMPONENTS/modal/CustomPrompt'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
const RadioGroup = Radio.Group
const InputGroup = Input.Group
const Option = Select.Option
const { TextArea } = Input

/**
 * [transformValue 表单值转换]
 * @Author   szh
 * @DateTime 2017-12-05
 * @param    {String}              field [表单字段]
 * @param    {str||num||bool}      value [当前值，可以是任何基本类型的值]
 * @return   {all}                       [返回所有类型的值]
 */
function transformValue(field, value) {
    if (value === null) return null
    let v
    if (field.indexOf('date') > -1) {
        // 日期组件的value必须使用moment
        v = valueToMoment(value)
    } else {
        v = value
    }
    return v
}

class WorkerAffairs extends Component {
    state = {
        // 查询
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
        // 是否查询中
        isQuerying: false,
        // 表格设置
        tableSetting: {
            loading: true,
            pagination: false,
            dataSource: []
        },
        // 对话框设置
        modalSetting: {
            title: '人员管理',
            visible: false
        },
        // 表单字段的值
        formFieldsValues: {
            id: {
                value: null
            },
            name: {
                value: null
            },
            realname: {
                value: null
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
        },
        // 操作类型 add 和 edit
        operationType: '',
        // 是否提交
        isSubmitting: false,
        // 记录表格被选择的行
        tableRowSelection: []
    }

    componentDidMount() {
        let page = this.props.location.state ? this.props.location.state.page : 1
        this.getData({page: page}, true)
    }

    getData = (params, first = false) => {
        let data = {
            params: params
        }
        this.setState({
            tableSetting: {
                loading: true
            }
        })
        index('user', data)
            .then(res => {
                let pagination = {
                    current: res.data.currentPage,
                    pageSize: res.data.pageSize,
                    total: res.data.total,
                    onChange: this.handlePageChange
                }
                this.setState({
                    tableSetting: {
                        loading: false,
                        pagination: pagination,
                        dataSource: res.data.data
                    }
                })
                this.props.history.push(`${this.props.location.pathname}?page=${params.page}`, {page: params.page})
            })
    }

    // 表格翻页
    handlePageChange = (page) => {
        this.getData({page: page})
    }

    // 查询条件改变时触发
    onQueryChange = (field, value) => {
        this.setState({
            query: {
                ...this.state.query,
                [field]: value
            }
        })
    }

    // 入职日期改变
    onEntryDateChange = (value, valueString) => {
        // value 为moment类型的值
        // valueString 为格式化后时间的值
        if (valueString && valueString[0].length === 0 && valueString[1].length === 0) {
            this.onQueryChange('entry_date', null)
        } else {
            this.onQueryChange('entry_date', valueString)
        }
    }

    // 离职日期改变
    onQuitDateChange = (value, valueString) => {
        if (valueString && valueString[0].length === 0 && valueString[1].length === 0) {
            this.onQueryChange('quit_date', null)
        } else {
            this.onQueryChange('quit_date', valueString)
        }
    }

    // 批量删除
    batchDelete = (e) => {
        if (this.state.tableRowSelection.length === 0) {
            message.warning('至少要选择一条数据')
            return
        }
        CustomPrompt({
            type: 'confirm',
            content: <div>{`是否要删除这${this.state.tableRowSelection.length}条数据`}</div>,
            okType: 'danger',
            onOk: () => {
                ajax('post', '/api/user/batch-delete', {ids: this.state.tableRowSelection})
                    .then(res => {
                        this.setState({
                            tableSetting: {
                                ...this.state.tableSetting,
                                dataSource: res.data
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    }

    // 新增
    addTableItem = (e) => {
        this.setState({
            modalSetting: {
                visible: true,
                title: '人员管理-新增用户'
            },
            operationType: 'add'
        })
    }

    // 表格行编辑回调
    editTableItem = (e) => {
        this.setState({
            operationType: 'edit'
        })
        let id = e.target.dataset['id']
        show(`/user/${id}`)
            .then(res => {
                console.log(res)
                this.setState((prevState, props) => {
                    let obj = {}
                    Object.keys(res.data).forEach(field => {
                        obj[field] = {
                            value: transformValue(field, res.data[field])
                        }
                    })
                    return {
                        modalSetting: {
                            visible: true,
                            title: '人员管理-编辑用户'
                        },
                        formFieldsValues: obj
                    }
                })
            })
    }

    // 表格行删除回调
    deleteTableItem = (e) => {
        let id = e.target.dataset['id']
        CustomPrompt({
            type: 'confirm',
            content: <div>是否要删除这条信息</div>,
            okType: 'danger',
            onOk: () => {
                destroy(`user/${id}`)
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
            }
        })
    }

    // 表单提交回调
    handleFormSubmit = (values) => {
        this.setState({
            isSubmitting: true
        })
        let submit = this.state.operationType === 'add'
            ? store('user', values)
            : update(`user/${this.state.formFieldsValues.id.value}`, values)
        submit
        .then(res => {
            this.setState({
                isSubmitting: false
            })
            if (res.data.errors) {
                res.data.errors.forEach(err => {
                    message.error(err.message)
                })
            } else {
                if (this.state.operationType === 'add') {
                // 新增后的处理
                    this.getData({page: 1})
                } else {
                // 编辑后的处理
                    this.setState((prevState, props) => {
                        let newDataSource = []
                        prevState.tableSetting.dataSource.forEach(data => {
                            if (data.id === prevState.formFieldsValues.id.value) {
                                newDataSource.push(res.data)
                            } else {
                                newDataSource.push(data)
                            }
                        })
                        return {
                            tableSetting: {
                                ...prevState.tableSetting,
                                dataSource: newDataSource
                            }
                        }
                    })
                }
                this.handleModalCancel()
                message.success('保存成功')
            }
        })
        .catch(err => {
            console.log(err)
            this.setState({
                isSubmitting: false
            })
        })
    }

    // 表单对话框取消回调
    handleModalCancel = (e) => {
        this.setState((prevState, props) => {
            let obj = {}
            for (let i in prevState.formFieldsValues) {
                obj[i] = {
                    value: null
                }
            }
            return {
                modalSetting: {
                    ...this.state.modalSetting,
                    visible: false
                },
                formFieldsValues: obj
            }
        })
    }

    // 更新表单数据
    updateFormFields = (changedFields) => {
        this.setState({
            formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
        })
    }

    // 更新查询表单数据
    updateQueryFields = (changedFields) => {
        this.setState({
            queryFieldValues: {...this.state.queryFieldValues, ...changedFields}
        })
    }

    // 处理查询
    handleQuery = (e) => {
        let params = {}
        for (let i in this.state.queryFieldValues) {
            if (this.state.queryFieldValues[i].value !== null) {
                params[i] = this.state.queryFieldValues[i].value
            }
        }
        if (Object.keys(params).length === 0) {
            message.warning('请增加查询条件')
            return
        }
        params['page'] = 1
        this.getData(params, false)
    }

    handleInputChange = (value) => {
        this.setState({
            queryFieldValue: value
        })
    }

    handleSearchTypeChange = (value) => {
        this.setState({
            queryField: value,
            queryFieldValue: null
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
            format: 'YYYY-MM-DD',
            onChange: this.onEntryDateChange,
            showTime: false,
            style: {
                width: 220
            }
        }

        const quitDate = {
            format: 'YYYY-MM-DD',
            onChange: this.onQuitDateChange,
            showTime: false,
            style: {
                width: 220
            }
        }
        const condition = [
            {
                label: '姓名',
                field: 'realname',
                component: (<Input autoComplete="off" placeholder="姓名" />)
            },
            {
                label: '邮箱',
                field: 'email',
                component: (<Input autoComplete="off" placeholder="邮箱" />)
            },
            {
                label: '职位',
                field: 'job',
                component: (<Input autoComplete="off" placeholder="职位" />)
            },
            {
                label: '入职日期',
                field: 'entry_date',
                component: <CustomRangePicker {...entryDate} />,
            },
            {
                label: '离职日期',
                field: 'quit_date',
                component: <CustomRangePicker {...quitDate} />,
            }
        ]
        const operationBtn = [
            () => <Button type="primary" onClick={this.addTableItem}>新增</Button>,
            () => <Button type="danger" onClick={this.batchDelete}>删除</Button>
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
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.deleteTableItem}>删除</a>
                    </span>
                )
            }
        ]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    tableRowSelection: selectedRowKeys
                })
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
                label: '用户名',
                field: 'name',
                valid: {
                    rules: [{required: true, message: '请输入用户名'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="用户名" />),
            },
            {
                label: '姓名',
                field: 'realname',
                valid: {
                    rules: [{required: true, message: '请输入姓名'}]
                },
                component: (<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="姓名" />)
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
                component: (<Input prefix={<Icon type="mail" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="邮箱" />)
            },
            {
                label: '电话',
                field: 'phone',
                valid: {
                    rules: [{ required: true, message: '请输入你的电话' }]
                },
                component: (<Input prefix={<Icon type="phone" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="电话" />)
            },
            {
                label: '出生日期',
                field: 'birth_date',
                valid: {
                    rules: [{required: true, message: '请选择出生日期'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '职位',
                field: 'job',
                valid: {
                    rules: [{required: true, message: '请输入职位'}]
                },
                component: (<Input autoComplete="off" placeholder="职位" />)
            },
            {
                label: '入职日期',
                field: 'entry_date',
                valid: {
                    rules: [{required: true, message: '请选择入职日期'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '离职日期',
                field: 'quit_date',
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            }
        ]
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={'查询'}
                    formFields={condition}
                    handleSubmit={this.handleQuery}
                    updateFormFields={this.updateQueryFields}
                    formFieldsValues={state.queryFieldValues}
                    isSubmitting={state.isQuerying}
                />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...state.tableSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
                <CustomModal {...state.modalSetting} footer={null} onCancel={this.handleModalCancel}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.handleFormSubmit}
                        updateFormFields={this.updateFormFields}
                        formFieldsValues={state.formFieldsValues}
                        isSubmitting={state.isSubmitting}
                    />
                </CustomModal>
            </div>
        )
    }
}

export default WorkerAffairs
