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
    Upload
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './Info.less'

// 引入工具方法
import {getBase64} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import moment from 'moment'
console.log(moment('2017-11-11', 'YYYY-MM-DD'))
console.log(moment('2017-12-12T03:17:32.000Z').format())

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
        this.props.handleAdd()
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
                field: 'name',
                component: (<Input autoComplete="off" placeholder="项目名称" />)
            },
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
                field: 'name',
                valid: {
                    rules: [{required: true, message: '请输入项目名称'}]
                },
                component: (<Input autoComplete="off" placeholder="项目名称" />),
            },
            {
                label: '项目负责人',
                field: 'user_id',
                valid: {
                    rules: [{required: true, message: '请选择项目负责人'}]
                },
                component: (
                    <Select>
                        <Option value={null}>请选择用户</Option>
                        {this.state.userData.map(u => (
                            <Option key={u.id} value={u.id}>{u.realname}</Option>
                        ))}
                    </Select>
                ),
            },
            {
                label: '项目介绍',
                field: 'introduce',
                valid: {
                    rules: [{required: true, message: '请输入项目介绍'}]
                },
                component: (
                    <TextArea rows={6} autoComplete="off" placeholder="项目介绍" />
                )
            },
            {
                label: '计划开始日期',
                field: 'plan_start_date',
                valid: {
                    rules: [{required: true, message: '请选择计划开始日期'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '计划结束日期',
                field: 'plan_end_date',
                valid: {
                    rules: [{required: true, message: '请选择计划结束日期'}]
                },
                component: <CustomDatePicker format="YYYY-MM-DD" showTime={false} />,
            },
            {
                label: '项目封面',
                field: 'img',
                component: (
                    <Upload {...uploadProps}>
                        {imageUrl ? (
                            <img className="block w100" src={imageUrl} />
                        ) : (
                            <div className="projectInfo-upload-btn">
                                <Icon type="plus" />
                            </div>
                        )}
                    </Upload>
                ),
                value: null
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
                <div className="mt-10">
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 4 }}
                        dataSource={this.props.tableSetting.dataSource}
                        renderItem={item => (
                            <List.Item>
                                {
                                    item.type
                                    ? (
                                        <Card
                                            hoverable="true"
                                            className="projectInfo-card"
                                            onClick={this.add}
                                        >
                                            <div className="projectInfo-card-add txt-c">
                                                <Icon type="plus" className="mr-10" />新增项目
                                            </div>
                                        </Card>
                                    ) : (
                                        <Card
                                            cover={<img src={`/uploadImgs/${item.img}`} />}
                                            actions={[<Icon type="ellipsis" />, <Icon type="edit" />, <Icon type="delete" />]}
                                        >
                                            <Meta
                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                title={
                                                    <div>
                                                        <h2>
                                                            item.name
                                                        </h2>
                                                        <p>{`项目计划开始时间：${item.plan_start_date}  项目计划结束时间：${item.plan_end_date}`}</p>
                                                    </div>
                                                }
                                                description={
                                                    <p>item.introduce</p>
                                                }
                                            />
                                        </Card>
                                    )
                                }
                            </List.Item>
                        )}
                    />
                    <Pagination className="pull-right" {...this.props.tableSetting.pagination} />
                </div>
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
    handleTableData: (res) => {
        res.unshift({
            type: 'add'
        })
        return res
    },
    formSubmitHasFile: true
})

export default PI
