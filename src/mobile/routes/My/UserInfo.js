import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, InputItem, ImagePicker, Picker, DatePicker, Toast } from 'antd-mobile'

import { checkPhone } from '../../../utils/regExp'
import { update } from '../../../utils/ajax'

import CustomForm from '../../components/CustomForm'

class UserInfo extends React.Component {
    state = {
        files: []
    }
    componentWillMount() {
        console.log(this.props.user)
        if (this.props.user && this.props.user.avatar) {
            this.setState({
                files: [
                    {
                        id: 1,
                        url: `/uploadImgs/${this.props.user.avatar}`
                    }
                ]
            })
        }
    }
    onFilesChange = (files, type, index) => {
        this.setState({
            files,
        })
        // if (files.length > 0 && files[0].file) {
        //     if (files[0].file.type !== 'image/jpeg' && files[0].file.type !== 'image/png') {
        //         Toast.info('上传的头像只能是图片', 1)
        //         return
        //     }
        //     if (files[0].file.size > 2 * 1024 * 1024) {
        //         Toast.info('上传图片不能超过2m', 1)
        //         return
        //     }
        //     this.setState({
        //         files,
        //     })
        // }
    }
    handleSubmit = (params) => {
        const {
            files
        } = this.state
        let data = {},
            hasFile = false
        if (files.length > 0 && files[0].file) {
            data['avatar'] = files[0].file
            hasFile = true
        }
        for (let i in params) {
            data[i] = params[i]
        }
        update(`user/${this.props.user.id}`, data, hasFile)
            .then(res => {
                if (res.data.errors) {
                    res.data.errors.forEach(err => {
                        Toast.info(err.message, 1)
                    })
                } else {
                    this.props.globalUpdateUser(res.data)
                    Toast.info('保存成功', 1, () => {
                        this.props.history.push('/home/my')
                    })
                }
            })
            .catch(() => {
                Toast.info('保存失败', 1)
            })
    }
    // 电话验证
    phoneValidator = (rule, value, callback) => {
        checkPhone(value, '电话')
        .then(resolve => {
            callback(resolve)
        })
    }
    render() {
        const {
            match,
            user,
        } = this.props
        const {
            files
        } = this.state
        const formFields = [
            ({getFieldProps}) => (
                <div>
                    <List.Item>头像</List.Item>
                    <ImagePicker
                        files={files}
                        onChange={this.onFilesChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={files.length < 1}
                    />
                </div>
            ),
            ({getFieldProps, getFieldError}) => (
                <InputItem
                    {...getFieldProps('realname', {
                        initialValue: user.realname,
                        rules: [{required: true, message: '请输入真实姓名'}]
                    })}
                    clear
                    error={!!getFieldError('realname')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('realname').join('、'), 1)
                    }}
                    placeholder="请输入真实姓名"
                >
                    真实姓名
                </InputItem>
            ),
            ({getFieldProps, getFieldError}) => (
                <Picker
                    data={[{label: '男', value: 'male'}, {label: '女', value: 'female'}]}
                    cols={1}
                    {...getFieldProps('gender', {
                        initialValue: [user.gender],
                        rules: [{required: true, message: '请选择性别'}]
                    })}
                >
                    <List.Item arrow="horizontal" error={!!getFieldError('gender')} >性别</List.Item>
                </Picker>
            ),
            ({getFieldProps, getFieldError}) => (
                <InputItem
                    {...getFieldProps('email', {
                        initialValue: user.email,
                        rules: [{
                            type: 'email', message: '邮箱格式不对'
                        }, {
                            required: true, message: '请输入邮箱'
                        }]
                    })}
                    clear
                    error={!!getFieldError('email')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('email').join('、'), 1)
                    }}
                    placeholder="请输入邮箱"
                >
                    邮箱
                </InputItem>
            ),
            ({getFieldProps, getFieldError}) => (
                <InputItem
                    {...getFieldProps('phone', {
                        initialValue: user.phone,
                        rules: [
                            { required: true, message: '请输入电话号码' },
                            { validator: this.phoneValidator },
                        ]
                    })}
                    error={!!getFieldError('phone')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('phone').join('、'), 1)
                    }}
                    placeholder="请输入电话"
                >
                    电话
                </InputItem>
            ),
            ({getFieldProps, getFieldError}) => (
                <DatePicker
                    mode="date"
                    {...getFieldProps('birth_date', {
                        initialValue: new Date(user.birth_date),
                        rules: [{required: true, message: '请选择出生日期'}],
                    })}
                >
                    <List.Item arrow="horizontal" error={!!getFieldError('birth_date')}>出生日期</List.Item>
                </DatePicker>
            ),
            ({getFieldProps, getFieldError}) => (
                <InputItem
                    {...getFieldProps('job', {
                        initialValue: user.job,
                        rules: [{required: true, message: '请输入职位'}]
                    })}
                    error={!!getFieldError('job')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('job').join('、'), 1)
                    }}
                    placeholder="请输入职位"
                >
                    职位
                </InputItem>
            ),
        ]
        return (
            <div>
                <CustomForm formFields={formFields} handleSubmit={this.handleSubmit} />
            </div>
        )
    }
}

export default UserInfo
