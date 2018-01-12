// 招聘管理
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
    Select,
    Upload
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const RadioGroup = Radio.Group
const { TextArea } = Input
const Option = Select.Option

class Recruit extends Component {
    state = {
        // 文件
        fileList: []
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
    /**
     * [是否通过]
     * @Author   szh
     * @DateTime 2017-12-19
     * @param    {Number}   id   [当前表格行的id]
     * @param    {String}   pass [选择是否pass]
     */
    handlePass = (id, pass) => {
        let values = {
            pass: pass
        }
        this.props.ajaxUpdate(id, values)
    }

    handleComment = (e) => {
        this.props.handleSetState('operationType', 'comment')
        // })
        let id = e.target.dataset['id']
        show(`/${this.props.model}/${id}`)
            .then(res => {
                this.props.handleSetState('modalSetting', {
                    ...this.props.modalSetting,
                    visible: true,
                    title: `${this.props.title}-评论`
                })
                this.props.updateEditFormFieldsValues(resetObject(res.data))
            })
    }

    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        const uploadProps = {
            action: '/recruit',
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

        // 条件
        const condition = [
            {
                label: '职位',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('job', {})(<Input className="mb-10" autoComplete="off" placeholder="请输入职位" />)
                },
            },
            {
                label: '面试时间',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('date', {})(<CustomRangePicker className="mb-10" format="YYYY-MM-DD" showTime={false} style={{ width: 220 }} />)
                },
            }
        ]

        // 操作
        const operationBtn = [
            () => <Button type="primary" className="mr-10" onClick={this.props.handleAdd}>新增</Button>
        ]

        // 表格
        const columns = [
            {
                title: '面试官',
                dataIndex: 'interviewer',
                key: 'interviewer'
            },
            {
                title: '面试者',
                dataIndex: 'interviewee',
                key: 'interviewee'
            },
            {
                title: '面试职位',
                dataIndex: 'job',
                key: 'job'
            },
            {
                title: '面试日期',
                dataIndex: 'date',
                key: 'date'
            },
            {
                title: '评价',
                dataIndex: 'comment',
                key: 'comment'
            },
            {
                title: '操作',
                key: 'action',
                width: 250,
                render: (text, record) => (
                    <span>
                        <a href="javascript:;" data-id={text.id} onClick={this.handleComment}>评价</a>
                        <Divider type="vertical" />
                        <Select defaultValue={text.pass} size="small" style={{ width: 80 }} onChange={(pass) => this.handlePass(text.id, pass)}>
                            <Option value="1">通过</Option>
                            <Option value="0">不通过</Option>
                        </Select>
                        <Divider type="vertical" />
                        <a href={`/uploadFiles/${text.recruit}`} data-id={text.id}>下载</a>
                    </span>
                )
            }
        ]

        // 表单
        const formFields = [
            {
                label: '面试官',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('interviewer', {
                        rules: [{required: true, message: '请输入面试官'}]
                    })(<Input autoComplete="off" placeholder="面试官" />)
                },
            },
            {
                label: '面试者',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('interviewee', {
                        rules: [{required: true, message: '请输入面试者'}]
                    })(<Input autoComplete="off" placeholder="面试者" />)
                },
            },
            {
                label: '面试职位',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('job', {
                        rules: [{required: true, message: '请输入职位'}]
                    })(<Input autoComplete="off" placeholder="面试职位" />)
                },
            },
            {
                label: '面试日期',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('date', {
                        rules: [{required: true, message: '请输入面试日期'}]
                    })(<CustomDatePicker format="YYYY-MM-DD" showTime={false} />)
                },
            },
            {
                label: '简历',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('recruit', {
                        rules: [{required: true, message: '请上传简历文件'}]
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> 选择文件
                            </Button>
                        </Upload>
                    )
                },
            }
        ]

        const commentFields = [
            {
                label: '评论',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('comment', {
                        rules: [{required: true, message: '请输入评论'}]
                    })(<TextArea rows={4} placeholder="对应聘者的评价" />)
                }
            }
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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
                <Table {...this.props.dataSetting} rowKey={record => record.id} columns={columns} />
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.handleModalCancel} user={this.props.user}>
                    {
                        this.props.operationType === 'add' || this.props.operationType === 'edit' ? (<CustomForm
                            formStyle={{width: '100%'}}
                            formFields={formFields}
                            handleSubmit={this.handleFormSubmit}
                            updateFormFields={this.props.updateFormFields}
                            formFieldsValues={this.props.formFieldsValues}
                            isSubmitting={this.props.isSubmitting}
                        />) : (<CustomForm
                            formStyle={{width: '100%'}}
                            formFields={commentFields}
                            handleSubmit={this.handleFormSubmit}
                            updateFormFields={this.props.updateFormFields}
                            formFieldsValues={this.props.formFieldsValues}
                            isSubmitting={this.props.isSubmitting}
                        />)
                    }
                </CustomModal>
            </div>
        )
    }
}

const R = withBasicDataModel(Recruit, {
    model: 'recruit',
    title: '招聘管理',
    modalSetting: {
        title: '招聘管理'
    },
    // 查询的
    queryFieldValues: {
        job: {
            value: null
        },
        date: {
            value: null
        },
    },
    formSubmitHasFile: true,
    // 表单的
    formFieldsValues: {
        id: {
            value: null
        },
        interviewer: {
            value: null
        },
        interviewee: {
            value: null
        },
        job: {
            value: null
        },
        date: {
            value: null
        },
        recruit: {
            value: null
        },
        comment: {
            value: null
        },
        pass: {
            value: null
        }
    }
})

export default R
