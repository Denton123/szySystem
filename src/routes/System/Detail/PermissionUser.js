import React, {Component} from 'react'
import {
    Button,
    Table,
    Input,
    Select
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {Option} = Select

class PermissionUser extends Component {
    state = {
        roleData: []
    }
    setRole = (e) => {
        console.log('setRole')
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
                field: 'realname',
                component: (<Input autoComplete="off" placeholder="姓名" />)
            },
            {
                label: '职位',
                field: 'job',
                component: (<Input autoComplete="off" placeholder="职位" />)
            },
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
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.setRole}>设置角色</a>
                    </span>
                )
            }
        ]

        // 表单
        const formFields = [
            {
                label: '用户名',
                field: 'role_ids',
                valid: {
                    rules: [{required: true, message: '请选择角色'}]
                },
                component: (
                    <Select
                        mode="multiple"
                        placeholder="设置角色"
                    >
                        {state.roleData.map(r => (
                            <Option key={r.id} value={r.id}>{r.display_name}</Option>
                        ))}
                    </Select>
                ),
            },
        ]
        return (
            <div>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={<Button type="primary" htmlType="submit">查询</Button>}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <Table className="mt-10" {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel}>
                    <CustomForm
                        formStyle={{width: '100%'}}
                        formFields={formFields}
                        handleSubmit={this.props.handleFormSubmit}
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
    title: '用户角色设置',
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
})

export default PU
