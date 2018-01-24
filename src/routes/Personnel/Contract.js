// 合同管理
import React, {Component} from 'react'
import { Icon, Input, Button, Table, Avatar, Select, Upload, Divider, message } from 'antd'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const Option = Select.Option

class Contract extends Component {
    state = {
        // 全部用户数据
        userData: [],
        // 文件
        fileList: []
    }

    add = () => {
        if (this.state.userData.length === 0) {
            ajax('get', '/user/all')
                .then(res => {
                    this.setState({
                        userData: res.data
                    })
                })
        }
        this.props.handleAdd()
    }

    handleModalCancel = (e) => {
        this.setState({
            fileList: []
        })
        this.props.handleModalCancel(e)
    }

    handleFormSubmit = (values) => {
        this.setState({
            fileList: []
        })
        let params = {
            date: formatDate()
        }
        for (let i in values) {
            params[i] = values[i]
        }
        this.props.handleFormSubmit(params)
    }

    render() {
        const condition = [
            {
                label: '姓名',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {})(<Input className="mb-10" autoComplete="off" placeholder="姓名" />)
                },
            }
        ]
        const operationBtn = [
            () => <Button type="primary" onClick={this.add}>新增</Button>
        ]
        const customFormOperation = [
            () => <Button type="primary" htmlType="submit">查询</Button>,
            () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
        ]

        const columns = [
            {
                title: '真实姓名',
                dataIndex: 'realname',
                key: 'realname',
            },
            {
                title: '上传日期',
                dataIndex: 'date',
                key: 'date',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href={`/uploadFiles/${text.contract}`} data-id={text.id}>下载</a>
                    </span>
                )
            }
        ]

        const uploadProps = {
            action: '/contract',
            onRemove: (file) => {
                this.setState({
                    fileList: []
                })
            },
            beforeUpload: (file) => {
                if (file.size > 2 * 1024 * 1024) {
                    message.error('上传文件不能超过2m')
                    return false
                }
                this.setState(() => {
                    let arr = []
                    arr.push(file)
                    return {
                        fileList: arr
                    }
                })
                return false
            },
            fileList: this.state.fileList,
        }

        // 表单
        const formFields = [
            {
                label: '用户名',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('user_id', {
                        rules: [{required: true, message: '请选择用户名'}]
                    })(
                        <Select>
                            <Option value={null}>请选择用户</Option>
                            {this.state.userData.map(u => (
                                <Option key={u.id} value={u.id}>{u.realname}</Option>
                            ))}
                        </Select>
                    )
                },
            },
            {
                label: '合同文件',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('contract', {
                        rules: [{required: true, message: '请上传合同文件'}]
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> 选择文件
                            </Button>
                        </Upload>
                    )
                },
            },
        ]

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
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.handleModalCancel} user={this.props.user}>
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

const Ct = withBasicDataModel(Contract, {
    model: 'contract',
    title: '合同管理',
    queryFieldValues: {
        realname: {
            value: null
        },
    },
    formFieldsValues: {
        user_id: {
            value: null
        },
        contract: {
            value: null
        }
    },
    formSubmitHasFile: true,
    handleData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    }
})

export default Ct
