import React, {Component} from 'react'
import {
    Input,
    Button,
    Divider,
    Table,
    Tree
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class PermissionRole extends Component {
    state = {
        permission: []
    }
    add = (e) => {
        ajax('get', '/role/all-permission')
        .then(res => {
            console.log(res)
        })
        this.props.handleAdd(e)
    }
    render() {
        const {
            history,
            location,
            match,
            route
        } = this.props

        const condition = [
            {
                label: '角色名称',
                field: 'display_name',
                component: (<Input autoComplete="off" placeholder="角色名称" />)
            },
        ]

        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.add}>新增</Button>,
            () => <Button type="danger" onClick={this.props.handleDelete}>删除</Button>
        ]

        // 表格
        const columns = [
            {
                title: '角色',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '角色名称',
                dataIndex: 'display_name',
                key: 'display_name',
            },
            {
                title: '操作',
                key: 'action',
                width: 200,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleEdit}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.props.handleDelete}>删除</a>
                    </span>
                )
            }
        ]

        const expandedRowRender = (record, text) => {
            // {
            //     title: '权限选择',
            //     dataIndex: 'Permission_ids',
            //     key: 'Permission_ids',
            // },
            // 显示该角色有的权限
            // TODO
            return null
        }

        // 表单
        const formFields = [
            {
                label: '角色',
                field: 'name',
                valid: {
                    rules: [{required: true, message: '请输入角色'}]
                },
                component: (<Input autoComplete="off" placeholder="角色" />),
            },
            {
                label: '角色名称',
                field: 'display_name',
                valid: {
                    rules: [{required: true, message: '请输入角色名称'}]
                },
                component: (<Input autoComplete="off" placeholder="角色名称" />),
            },
            {
                label: '权限选择',
                field: 'permission_ids',
                valid: {
                    // rules: [{required: true, message: '请选择角色权限'}]
                },
                component: (<Input autoComplete="off" placeholder="邮箱" />)
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
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} expandedRowRender={expandedRowRender} />
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

const PR = withBasicDataModel(PermissionRole, {
    model: 'role',
    title: '角色管理',
    queryFieldValues: {
        display_name: {
            value: null
        },
    },
    formFieldsValues: {
        id: {
            value: null
        },
        name: {
            value: null
        },
        display_name: {
            value: null
        },
        permission_ids: {
            value: null
        },
    },
    locationSearch: false,
})

export default PR
