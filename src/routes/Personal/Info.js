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
                field: 'avatar',
                component: (
                    <Upload {...uploadProps}>
                        <Avatar
                            size="large"
                            src={imageUrl}
                            icon="user"
                        />
                    </Upload>
                ),
                value: null
            },
            {
                label: '用户名',
                field: 'name',
                valid: {
                    rules: [{required: true, message: '请输入用户名'}]
                },
                component: (<Input disabled prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />),
                value: null
            },
            {
                label: '真实姓名',
                field: 'realname',
                valid: {
                    rules: [{required: true, message: '请输入真实姓名'}]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="真实姓名" />),
                value: null
            },
            {
                label: '性别',
                field: 'gender',
                valid: {
                    rules: [{required: true, message: '请选择性别'}]
                },
                component: (
                    <RadioGroup>
                        <Radio disabled={state.formDisabled} value="male">男</Radio>
                        <Radio disabled={state.formDisabled} value="female">女</Radio>
                    </RadioGroup>
                )
            },
            {
                label: '邮箱',
                field: 'email',
                valid: {
                    rules: [{
                        type: 'email', message: '邮箱格式不对'
                    }, {
                        required: true, message: '请输入邮箱'
                    }]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="邮箱" />)
            },
            {
                label: '电话',
                field: 'phone',
                valid: {
                    rules: [
                        { required: true, message: '请输入你的电话' },
                        {
                            validator: checkPhone
                        }
                    ]
                },
                component: (<Input disabled={state.formDisabled} prefix={<Icon type="phone" style={{ fontSize: 13 }} />} placeholder="电话" />)
            },
            {
                label: '出生日期',
                field: 'birth_date',
                valid: {
                    rules: [{required: true, message: '请选择出生日期'}]
                },
                component: <CustomDatePicker disabled={state.formDisabled} format="YYYY-MM-DD" showTime={false} />
            },
            {
                label: '职位',
                field: 'job',
                valid: {
                    rules: [{required: true, message: '请输入职位'}]
                },
                component: (<Input disabled={state.formDisabled} placeholder="职位" />)
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
