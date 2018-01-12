import React, {Component} from 'react'
import {
    Input,
    Button,
    Divider,
    Table,
    List,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {resetObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'
import {checkFormField} from 'UTILS/regExp'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import CustomTree from 'COMPONENTS/tree/CustomTree'

/**
 * [setPermissions 设置tree结构的权限]
 * @Author   szh
 * @DateTime 2017-12-26
 * @param    {array}   permission [权限接口数组]
 * @return   {array}              [权限数组]
 */
function setPermissions(permission) {
    let arr = []
    permission.forEach(per => {
        arr.push({
            title: per.display_name,
            key: `permission-${per.id}`
        })
    })
    return arr
}

/**
 * [setList 设置tree数据结构]
 * @Author   szh
 * @DateTime 2017-12-26
 * @param    {array}   menu     [菜单数组]
 * @return   {array}            [重置后的tree结构数组]
 */
function setList(menu) {
    let arr = []
    menu.forEach(m => {
        let obj = {
            title: m.name,
            key: `menu-${m.id}`,
        }
        if (m.children || m.Permissions.length > 0) {
            obj['children'] = []
        }
        if (m.Permissions && m.Permissions.length > 0) {
            obj['children'].push({
                title: '权限',
                key: `permission-0-${m.id}`,
                children: setPermissions(m.Permissions)
            })
        }
        if (m.children) {
            obj['children'].push({
                title: '下级菜单',
                key: `menu-0-${m.id}`,
                children: setList(m.children)
            })
        }
        arr.push(obj)
    })
    return arr
}

class PermissionRole extends Component {
    state = {
        permission: [], // 记录当前角色保存的权限
        permissionList: [] // 后台返回的菜单和权限结构
    }
    componentDidMount() {
        // let params = {
        //     _current: this.props.current,
        //     page: this.props.location.state ? this.props.location.state.page : 1,
        // }
        // this.props.getData(params)
        ajax('get', '/permission/all')
            .then(res => {
                let list = setList(res.data)
                this.setState({
                    permissionList: list
                })
            })
    }
    add = (e) => {
        this.setState({
            permission: []
        })
        this.props.handleAdd(e)
    }
    edit = (e) => {
        this.props.handleEdit(e, (res) => {
            this.props.handleSetState('modalSetting', {
                ...this.props.modalSetting,
                visible: true,
                title: `${this.props.title}-编辑`
            })
            this.props.updateEditFormFieldsValues(resetObject(res.data))
            let permission = []
            res.data.Permissions.forEach(p => {
                permission.push(`permission-${p.id}`)
            })
            this.setState({
                permission: permission
            })
        })
    }
    handleDelete = (e) => {
        let id = e.target.dataset['id']
        e.persist()
        axios.post(`/role/use-count`, {role_ids: [id]})
            .then(res => {
                console.log(res)
                if (res.data[0].Users.length !== 0) {
                    message.warning('不能删除，该角色已有用户使用！')
                } else {
                    this.props.handleDelete(e)
                }
            })
    }
    handleBatchDelete = (e) => {
        e.persist()
        console.log(this.props.rowSelection)
        axios.post(`/role/use-count`, {role_ids: this.props.rowSelection})
            .then(res => {
                let delBol = true
                let useRoleArr = []
                res.data.forEach(itemObj => {
                    if (itemObj.Users.length !== 0) {
                        delBol = false
                        useRoleArr.unshift(itemObj.name)
                    }
                })
                delBol ? this.props.handleBatchDelete(e) : message.warning(`不能删除，${useRoleArr}角色已有用户使用！`)
            })
    }
    handleTreeCheck = (checkedKeys) => {
        this.setState({
            permission: checkedKeys
        })
    }
    handleFormSubmit = (values) => {
        let permission = []
        this.state.permission.forEach(p => {
            // 权限，而且不包含0的值
            if (p.indexOf('permission') > -1 && p.indexOf('-0-') === -1) {
                let pid = p.split('-')[p.split('-').length - 1]
                permission.push(parseInt(pid))
            }
        })
        values['permission_ids'] = permission
        this.props.handleFormSubmit(values)
        this.setState({
            permission: []
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
                label: '角色名称',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('display_name', {})(<Input autoComplete="off" placeholder="角色名称" />)
                },
            },
        ]

        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.add}>新增</Button>,
            () => <Button type="danger" onClick={this.handleBatchDelete}>删除</Button>
        ]
        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]

        const rowSelection = {
            onChange: this.props.handleTableRowChange
        }

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
                        <a href="javascript:;" data-id={text.id} onClick={this.edit}>编辑</a>
                        <Divider type="vertical" />
                        <a href="javascript:;" data-id={text.id} onClick={this.handleDelete}>删除</a>
                    </span>
                )
            }
        ]

        const expandedRowRender = (record, text) => {
            return (
                <List
                    size="small"
                    style={{maxHeight: 220, overflowY: 'auto'}}
                    dataSource={record.Permissions}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<div>名称：{item.display_name}</div>}
                                description={
                                    <div>
                                        <span>方法：{item.method}</span>
                                        <span>资源：{item.resource}</span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )
        }

        // 表单
        const formFields = [
            {
                label: '角色',
                content: ({getFieldDecorator}) => {
                    let id = 0
                    if (this.props.formFieldsValues.id.value) {
                        id = this.props.formFieldsValues.id.value
                    }
                    const validator = (rule, value, callback) => {
                        checkFormField(rule.field, value, 'Role', '角色', id)
                        .then(res => {
                            callback(res)
                        })
                    }
                    return getFieldDecorator('name', {
                        validateTrigger: ['onBlur'],
                        rules: [{required: true, validator: validator}]
                    })(<Input autoComplete="off" placeholder="角色" />)
                },
            },
            {
                label: '角色名称',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('display_name', {
                        rules: [{required: true, message: '请输入角色名称'}]
                    })(<Input autoComplete="off" placeholder="角色名称" />)
                },
            },
            {
                label: '权限选择',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('permission_ids', {})(<CustomTree checkedKeys={state.permission} onCheck={this.handleTreeCheck} list={state.permissionList} />)
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
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} expandedRowRender={expandedRowRender} rowSelection={rowSelection} />
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
    }
    // ,
    // customGetData: true,
    // locationSearch: false,
})

export default PR
