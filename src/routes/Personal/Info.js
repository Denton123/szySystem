import React, {Component} from 'react'
import {
    Icon,
    Button,
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Checkbox,
    AutoComplete,
    Radio,
    DatePicker,
    Upload,
    message,
    Avatar
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import CustomForm from 'COMPONENTS/form/CustomForm'

// 引入头像上传组件
// import AvatarUpload from 'COMPONENTS/input/AvatarUpload/AvatarUpload'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'
// 引入工具方法
import {checkPhone} from 'UTILS/regExp'
import {ajax, show} from 'UTILS/ajax'
import {getBase64} from 'UTILS/utils'

const RadioGroup = Radio.Group

class Info extends Component {
    state = {
        // 编辑状态（true/不可编辑，false/可编辑）
        formDisabled: false,
        imageUrl: null,
        fileList: []
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        if (!this.props.user) {
            this.props.history.push('/login')
        }
        let uid = this.props.user.id
        show(`user/${uid}`)
            .then(res => {
                // 直接更新内部表单数据
                this.props.updateEditFormFieldsValues(res.data)
                this.setState({
                    imageUrl: res.data.avatar ? `/uploadImgs/${res.data.avatar}` : null
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleFormSubmit = (values) => {
        this.props.handleFormSubmit(values, (res) => {
            this.props.globalUpdateUser(res.data)
            message.success('保存成功')
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
        const state = this.state
        const imageUrl = this.state.imageUrl

        const uploadProps = {
            action: '/user',
            onRemove: (file) => {
                this.setState({
                    fileList: []
                })
            },
            beforeUpload: (file) => {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    message.error('上传的头像只能是图片')
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

         // 表单
        const formFields = [
            {
                label: '头像',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('avatar', {})(
                        <Upload {...uploadProps} disabled={state.formDisabled}>
                            <Avatar
                                size="large"
                                src={imageUrl}
                                icon="user"
                            />
                            <div>点击头像上传新图片</div>
                        </Upload>
                    )
                },
            },
            {
                label: '用户名',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入用户名'}]
                    })(<Input disabled placeholder="用户名" />)
                },
            },
            {
                label: '真实姓名',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('realname', {
                        rules: [{required: true, message: '请输入真实姓名'}]
                    })(<Input disabled={state.formDisabled} placeholder="真实姓名" />)
                },
            },
            {
                label: '性别',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('gender', {
                        rules: [{required: true, message: '请选择性别'}]
                    })(
                        <RadioGroup>
                            <Radio disabled={state.formDisabled} value="male">男</Radio>
                            <Radio disabled={state.formDisabled} value="female">女</Radio>
                        </RadioGroup>
                    )
                },
            },
            {
                label: '邮箱',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '邮箱格式不对'
                        }, {
                            required: true, message: '请输入邮箱'
                        }]
                    })(<Input disabled={state.formDisabled} placeholder="邮箱" />)
                },
            },
            {
                label: '电话',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('phone', {
                        rules: [
                            { required: true, message: '请输入你的电话' },
                            {
                                validator: checkPhone
                            }
                        ]
                    })(<Input disabled={state.formDisabled} placeholder="电话" />)
                },
            },
            {
                label: '出生日期',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('birth_date', {
                        rules: [{required: true, message: '请选择出生日期'}]
                    })(<CustomDatePicker disabled={state.formDisabled} format="YYYY-MM-DD" showTime={false} />)
                },
            },
            {
                label: '职位',
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('job', {
                        rules: [{required: true, message: '请输入职位'}]
                    })(<Input disabled={state.formDisabled} placeholder="职位" />)
                },
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    formFields={formFields}
                    handleSubmit={this.handleFormSubmit}
                    updateFormFields={this.props.updateFormFields}
                    formFieldsValues={this.props.formFieldsValues}
                    customFormOperation={<Button type="primary" htmlType="submit" loading={this.props.isSubmitting}>保存</Button>}
                />
            </div>
        )
    }
}

const IF = withBasicDataModel(Info, {
    model: 'user',
    formFieldsValues: {
        avatar: {
            value: null
        },
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
    },
    customGetData: true,
    clearFormValues: false,
    formSubmitHasFile: true,
})

export default IF
