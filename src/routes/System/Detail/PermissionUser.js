import React, {Component} from 'react'
import {
    Button,
    Table,
    Input,
    Select,
    message,
    Checkbox,
    Divider,
    Modal,
    Popconfirm
} from 'antd'

import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {Option} = Select
const confirm = Modal.confirm

class PermissionUser extends Component {
    state = {
        // 获取角色数据列表
        roleData: []
    }

    getRoleData = () => {
        ajax('get', '/role/all')
        .then(res => {
            this.setState({
                roleData: res.data
            })
        })
    }

    componentDidMount() {
        let data = {
            page: 1,
            ...this.props.location.state,
        }
        this.getRoleData()
        this.props.getData(data)
    }

    onHighestChange = (e) => {
        let uid = e.target.uid
        let data = {}
        if (e.target.checked) {
            data['highest'] = '1'
        } else {
            data['highest'] = '0'
        }
        ajax('post', `/user/${uid}/highest`, data)
            .then(res => {
                if (Object.keys(res.data).length > 0) {
                    let newDataSource = []
                    this.props.dataSetting.dataSource.forEach(data => {
                        if (data.id === res.data.id) {
                            newDataSource.push(res.data)
                        } else {
                            newDataSource.push(data)
                        }
                    })
                    this.props.handleSetState('dataSetting', {
                        ...this.props.dataSetting,
                        dataSource: newDataSource
                    })
                    if (this.props.user.id === res.data.id) {
                        this.props.globalUpdateUser(res.data)
                    }
                    message.success('保存成功')
                } else {
                    message.error('保存失败')
                }
            })
            .catch(() => {
                message.error('出错了')
            })
    }

    setRole = (e) => {
        this.props.handleSetState('operationType', 'edit')
        let id = e.target.dataset['id']
        ajax('get', `/role/get-role/${id}`)
        .then(res => {
            this.props.handleSetState('modalSetting', {
                ...this.props.modalSetting,
                visible: true,
                title: `${this.props.title}`
            })
            this.props.updateEditFormFieldsValues(res.data)
        })
    }
    reSet = (e) => {
        let id = e.target.dataset['id']
        confirm({
            title: '确定要一键重置密码吗',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                ajax('get', `/user/oneclick/${id}`).then(res => {
                    if (res.data === 'success') {
                        message.success('重置成功')
                    }
                })
            }
        })
    }
    handleFormSubmit = (values) => {
        let id = this.props.formFieldsValues.id.value
        ajax('post', `/role/set-role/${id}`, values)
        .then(res => {
            this.props.handleSetState('isSubmitting', false)
            let newDataSource = []
            this.props.dataSetting.dataSource.forEach(data => {
                if (data.id === res.data.id) {
                    newDataSource.push(res.data)
                } else {
                    newDataSource.push(data)
                }
            })
            this.props.handleSetState('dataSetting', {
                ...this.props.dataSetting,
                dataSource: newDataSource
            })
            this.props.handleModalCancel()
            message.success('保存成功')
        })
        .catch(() => {
            message.success('保存失败')
            this.props.handleSetState('isSubmitting', false)
        })
    }
    render() {
        const {
            history,
            location,
            match,
            route
        } = this.props
        const state = this.state

        const condition = [
            {
                label: '姓名',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="姓名" />)
                },
            },
            {
                label: '职位',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('job', {})(<Input className="mb-10" autoComplete="off" placeholder="职位" />)
                },
            },
        ]
        const customFormOperation = [
            () => <Button className="mr-10" type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]

        // 表格
        const columns = [
            {
                title: '用户名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '姓名',
                dataIndex: 'realname',
                key: 'realname',
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
                title: '用户角色',
                dataIndex: 'role',
                key: 'role',
                render: (text, record) => {
                    let roles = []
                    record.Roles.forEach(r => {
                        roles.push(r.display_name)
                    })
                    return (
                        <div>{roles.join(',')}</div>
                    )
                }
            },
            {
                title: '最高级权限',
                dataIndex: 'highest',
                key: 'highest',
                render: (text, record) => <Checkbox uid={record.id} checked={text === '1' ? true : false} onChange={this.onHighestChange} />
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => {
                    let roles = []
                    record.Roles.forEach(r => {
                        roles.push(r.display_name)
                    })
                    return (
                        <span>
                            <a href="javascript:;" data-id={text.id} onClick={this.setRole}>设置角色</a>
                            <Divider type="vertical" />
                            {
                                roles && roles == '最高级管理' ? (
                                    <a href="javascript:;" data-id={text.id} onClick={this.reSet}>重置密码</a>
                                    ) : null
                            }
                        </span>
                    )
                    
                }
            }
        ]

        // 表单
        const formFields = [
            {
                label: '用户角色',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('role_ids', {
                        rules: [{required: false, message: '请选择角色'}]
                    })(
                        <Select
                            mode="multiple"
                            placeholder="设置角色"
                        >
                            {this.state.roleData.map(r => (
                                <Option key={r.id} value={r.id}>{r.display_name}</Option>
                            ))}
                        </Select>
                    )
                },
            },
        ]
        return (
            <div>
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
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} user={this.props.user}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.handleFormSubmit}
                        updateFormFields={this.props.updateFormFields}
                        formFieldsValues={this.props.formFieldsValues}
                        isSubmitting={this.props.isSubmitting}
                    />
                </CustomModal>
            </div>
        )
    }
}

const PU = withBasicDataModel(PermissionUser, {
    model: 'user',
    title: '设置用户角色',
    queryFieldValues: {
        realname: {
            value: null
        },
        job: {
            value: null
        },
    },
    formFieldsValues: {
        id: {
            value: null
        },
        role_ids: {
            value: []
        },
    },
    clearFormValues: {
        id: {
            value: null
        },
        role_ids: {
            value: []
        },
    },
    customGetData: true,
    // locationSearch: false
})

export default PU
