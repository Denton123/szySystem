import React, {Component} from 'react'
import {
    Input,
    Button,
    Card,
    Icon,
    Avatar,
    List,
    Pagination,
    Select,
    Upload,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './Info.less'

// 引入工具方法
import {getBase64, resetObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'
import {checkFormField} from 'UTILS/regExp'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {Meta} = Card
const {Option} = Select
const {TextArea} = Input

class ProjectInfo extends Component {
    state = {
        // 全部用户数据
        userData: [],
        // 文件
        fileList: [],
        imageUrl: null
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
        this.setState({
            fileList: [],
            imageUrl: null
        })
        this.props.handleAdd()
    }
    edit = (e) => {
        if (this.state.userData.length === 0) {
            ajax('get', '/user/all')
                .then(res => {
                    this.setState({
                        userData: res.data
                    })
                })
        }
        let img = e.target.dataset['img']
        this.setState({
            imageUrl: img ? `/uploadImgs/${img}` : img
        })
        this.props.handleEdit(e)
    }
    handleFormSubmit = (values) => {
        this.props.handleFormSubmit(values)
        this.setState({
            imageUrl: null
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
        const imageUrl = this.state.imageUrl
        const condition = [
            {
                label: '项目名称',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('name', {})(<Input className="mb-10" autoComplete="off" placeholder="项目名称" />)
                },
            },
        ]

        const operationBtn = [
            () => <Button type="primary" onClick={this.add}>新增</Button>
        ]

        const uploadProps = {
            action: '/project',
            onRemove: (file) => {
                this.setState({
                    fileList: []
                })
            },
            beforeUpload: (file) => {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    message.error('上传的封面只能是图片')
                    return
                }
                if (file.size > 2 * 1024 * 1024) {
                    message.error('上传图片不能超过2m')
                    return
                }
                this.setState({
                    isImageLoading: true
                })
                getBase64(file, imageUrl => this.setState({
                    isImageLoading: false,
                    imageUrl,
                }))
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
            showUploadList: false
        }

        const formFields = [
            {
                label: '项目名称',
                content: ({getFieldDecorator}) => {
                    let id = 0
                    if (this.props.formFieldsValues.id.value) {
                        id = this.props.formFieldsValues.id.value
                    }
                    const validator = (rule, value, callback) => {
                        checkFormField(rule.field, value, 'Project', '项目名称', id)
                        .then(res => {
                            callback(res)
                        })
                    }
                    return getFieldDecorator('name', {
                        validateTrigger: ['onBlur'],
                        rules: [{required: true, validator: validator}]
                    })(<Input autoComplete="off" placeholder="项目名称" />)
                },
            },
            {
                label: '项目负责人',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('user_id', {
                        rules: [{required: true, message: '请选择项目负责人'}]
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
                label: '项目介绍',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('introduce', {
                        rules: [{required: true, message: '请输入项目介绍'}]
                    })(<TextArea rows={6} autoComplete="off" placeholder="项目介绍" />)
                },
            },
            {
                label: '计划开始日期',
                content: ({getFieldDecorator}) => {
                    const disabledDate = (dateValue) => {
                        return Date.now() > new Date(dateValue).getTime()
                    }
                    return getFieldDecorator('plan_start_date', {
                        rules: [{required: true, message: '请选择计划开始日期'}]
                    })(<CustomDatePicker format="YYYY-MM-DD" showTime={false} disabledDate={disabledDate} />)
                },
            },
            {
                label: '计划结束日期',
                content: ({getFieldDecorator, getFieldValue}) => {
                    const disabledDate = (dateValue) => {
                        return new Date(getFieldValue('plan_start_date')).getTime() > new Date(dateValue).getTime()
                    }
                    return getFieldDecorator('plan_end_date', {
                        rules: [{required: true, message: '请选择计划结束日期'}]
                    })(<CustomDatePicker format="YYYY-MM-DD" showTime={false} disabledDate={disabledDate} />)
                },
            },
            {
                label: '项目封面',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('img', {})(
                        <Upload {...uploadProps}>
                            {imageUrl ? (
                                <img className="block w100" src={imageUrl} />
                            ) : (
                                <div className="projectInfo-upload-btn">
                                    <Icon type="plus" />
                                </div>
                            )}
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
                    customFormOperation={<Button type="primary" htmlType="submit">查询</Button>}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <BasicOperation className="mt-10 mb-10" operationBtns={operationBtn} />
                <List
                    itemLayout="vertical"
                    {...this.props.dataSetting}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <Icon type="edit" className="projectInfo-listItem-actions" data-id={item.id} data-img={item.img} onClick={this.edit} />,
                                <Icon type="delete" className="projectInfo-listItem-actions" data-id={item.id} onClick={this.props.handleDelete} />
                            ]}
                            extra={<img width={272} height={155} alt="logo" src={`/uploadImgs/${item.img}`} />}
                        >
                            <List.Item.Meta
                                title={
                                    <div className="projectInfo-listItem-metaTitle">
                                        <h2>
                                            <Link to={`${match.path}/${item.id}`}>{item.name}</Link>
                                        </h2>
                                        <ul className="clearfix">
                                            <li className="pull-left">{`负责人：${item.realname}`}</li>
                                            <li className="pull-left">{`项目计划开始时间：${item.plan_start_date}`}</li>
                                            <li className="pull-left">{`项目计划结束时间：${item.plan_end_date}`}</li>
                                        </ul>
                                    </div>
                                }
                                description={
                                    <div className="projectInfo-listItem-metaDesc">{item.introduce}</div>
                                }
                            />
                        </List.Item>
                    )}
                />
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

const PI = withBasicDataModel(ProjectInfo, {
    model: 'project',
    title: '项目管理',
    modalSetting: {
        title: '项目管理'
    },
    queryFieldValues: {
        name: {
            value: null
        },
    },
    formFieldsValues: {
        id: {
            value: null
        },
        user_id: {
            value: null
        },
        name: {
            value: null
        },
        img: {
            value: null
        },
        introduce: {
            value: null
        },
        plan_start_date: {
            value: null
        },
        plan_end_date: {
            value: null
        },
    },
    handleData: (dataSource) => {
        let arr = []
        dataSource.forEach(data => {
            arr.push(resetObject(data))
        })
        return arr
    },
    formSubmitHasFile: true
})

export default PI
