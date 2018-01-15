import React from 'react'
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
    Select,
    InputNumber
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
import {checkFormField} from 'UTILS/regExp'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'
import InputRange from 'COMPONENTS/input/InputRange'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const RadioGroup = Radio.Group

module.exports = function(opts) {
    class Asset extends React.Component {
        checkNumber = (rule, value, callback) => {
            if (!value || (value.number1 === undefined && value.number2 === undefined)) {
                callback()
                return
            }
            if (value.number1 <= value.number2) {
                callback()
                return
            }
            callback('两个都必选填，单价1小于单价2!')
        }

        handleFormSubmit = (values) => {
            let data = {}
            for (let i in values) {
                data[i] = values[i]
            }
            data['belong'] = opts.belong
            this.props.handleFormSubmit(data)
        }
        handleQuery = (values) => {
            console.log('handleQuery ------ ')
            console.log(values)
            this.props.handleQuery()
        }

        render() {
            const {
                child,
                route,
                history,
                location,
                match
            } = this.props

            // 条件
            const condition = [
                {
                    label: '名称',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('name', {})(<Input className="mb-10" autoComplete="off" placeholder="名称" />)
                    },
                },
                {
                    label: '单价',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('price', {
                            initialValue: { number1: 0, number2: 0 },
                            rules: [{ validator: this.checkNumber }]
                        })(<InputRange autoComplete="off" placeholder="单价" />)
                    },
                },
                {
                    label: '购买日期',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('date', {})(<CustomRangePicker className="mb-10" format="YYYY-MM-DD" showTime={false} style={{ width: 220 }} />)
                    },
                }
            ]

            // 操作
            const operationBtn = [
                () => <Button className="mr-10" type="primary" onClick={this.props.handleAdd}>新增</Button>,
                () => <Button type="danger" onClick={this.props.handleBatchDelete}>删除</Button>
            ]

            const customFormOperation = [
                () => <Button type="primary" htmlType="submit">查询</Button>,
                () => <Button type="primary" htmlType="reset" onClick={this.props.handleReset}>重置</Button>
            ]

            // 表格
            let columns = [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: 120
                },
                {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price',
                    width: 100
                },
                {
                    title: '数量',
                    dataIndex: 'number',
                    key: 'number',
                    width: 70
                },
                {
                    title: '购买日期',
                    dataIndex: 'date',
                    key: 'date'
                },
                {
                    title: '购买人',
                    dataIndex: 'purchase',
                    key: 'purchase'
                },
                {
                    title: '类型',
                    dataIndex: 'type',
                    key: 'type',
                    render: (text) => (
                        <span>{parseInt(text) === 1 ? '公司' : '学校'}</span>
                    )
                },
                {
                    title: '备注',
                    dataIndex: 'memo',
                    key: 'memo'
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

            const rowSelection = {
                onChange: this.props.handleTableRowChange
            }

            // 表单
            let formFields = [
                {
                    label: '名称',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名称'}]
                        })(<Input autoComplete="off" placeholder="名称" />)
                    },
                },
                {
                    label: '单价',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('price', {
                            rules: [
                                {
                                    type: 'number', message: '请输入数字类型'
                                },
                                {
                                    required: true, message: '请输入单价'
                                }
                            ]
                        })(<InputNumber autoComplete="off" placeholder="单价" min={0} />)
                    },
                },
                {
                    label: '数量',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('number', {
                            rules: [
                                {
                                    type: 'number', message: '请输入数字类型'
                                },
                                {
                                    required: true, message: '请输入数量'
                                }
                            ]
                        })(<InputNumber autoComplete="off" placeholder="数量" min={0} />)
                    },
                },
                {
                    label: '购买日期',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('date', {
                            rules: [{required: true, message: '请选择购买日期'}]
                        })(<CustomDatePicker format="YYYY-MM-DD" showTime={false} />)
                    },
                },
                {
                    label: '购买人',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('purchase', {
                            rules: [{required: true, message: '请输入购买人'}]
                        })(<Input autoComplete="off" placeholder="购买人" />)
                    },
                },
                {
                    label: '类型',
                    content: ({getFieldDecorator}) => {
                        return getFieldDecorator('type', {})(
                            <RadioGroup>
                                <Radio value="1">公司</Radio>
                                <Radio value="2">学校</Radio>
                            </RadioGroup>
                        )
                    },
                },
            ]

            if (opts.belong === 'equipment') {
                columns.unshift({
                    title: 'rifd',
                    dataIndex: 'rfid',
                    key: 'rfid',
                    width: 150
                })

                formFields.unshift({
                    label: 'rfid',
                    content: ({getFieldDecorator}) => {
                        console.log(this.props.formFieldsValues)
                        let id = 0
                        if (this.props.formFieldsValues.id.value) {
                            id = this.props.formFieldsValues.id.value
                        }
                        const validator = (rule, value, callback) => {
                            checkFormField(rule.field, value, 'Asset', 'rfid', id)
                            .then(res => {
                                callback(res)
                            })
                        }
                        return getFieldDecorator('rfid', {
                            validateTrigger: ['onBlur'],
                            rules: [{required: true, validator: validator}]
                        })(<Input autoComplete="off" placeholder="rfid" />)
                    },
                })
            }

            return (
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                    <CustomForm
                        layout="inline"
                        formStyle={{width: '100%'}}
                        customFormOperation={customFormOperation}
                        formFields={condition}
                        handleSubmit={this.handleQuery}
                        updateFormFields={this.props.updateQueryFields}
                        formFieldsValues={this.props.queryFieldValues}
                    />
                    <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                    <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} rowSelection={rowSelection} />
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
    const As = withBasicDataModel(Asset, {
        model: 'asset',
        title: opts.title,
        subModel: {belong: opts.belong},
        // 查询的
        queryFieldValues: {
            name: {
                value: null
            },
            price: {
                value: null
            },
            date: {
                value: null
            }
        },
        // 表单的
        formFieldsValues: {
            id: {
                value: null
            },
            name: {
                value: null
            },
            rfid: {
                value: null
            },
            price: {
                value: null
            },
            number: {
                value: null
            },
            date: {
                value: null
            },
            purchase: {
                value: null
            },
            type: {
                value: '1'
            },
            belong: {
                value: opts.belong
            }
        },
        clearFormValues: {
            id: {
                value: null
            },
            name: {
                value: null
            },
            rfid: {
                value: null
            },
            price: {
                value: null
            },
            number: {
                value: null
            },
            date: {
                value: null
            },
            purchase: {
                value: null
            },
            type: {
                value: '1'
            },
            belong: {
                value: opts.belong
            }
        },
    })
    return As
}
