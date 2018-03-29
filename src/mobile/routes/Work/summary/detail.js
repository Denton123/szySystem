import React from 'react'
import { List, InputItem, TextareaItem, Toast } from 'antd-mobile'

import { formatDate } from '../../../../utils/utils'
import { mStore, mShow, mUpdate } from '../../../../utils/ajax'

import CustomForm from '../../../components/CustomForm'

class SummaryDetail extends React.Component {
    constructor(props) {
        super(props)
        // 根据路由查询来确定是新增还是编辑
        // ?type=add
        let searchArr = this.props.location.search.substr(1).split('&'),
            urlSearch = {}
        searchArr.forEach(sa => {
            let arr = sa.split('=')
            urlSearch[arr[0]] = arr[1]
        })
        this.state = {
            summary: {
                title: null,
                content: null,
            },
            ...urlSearch,
        }
    }
    componentWillMount() {
        // 判断如果是编辑状态的话自动获取数据
        if (this.state._type === 'edit') {
            mShow(`${this.props.match.params.model}/${this.state.id}`)
                .then(res => {
                    this.setState({
                        summary: {
                            ...res.data
                        }
                    })
                })
        }
    }
    handleSubmit = (params) => {
        let data = {
            user_id: this.props.user.id,
        }
        if (this.state._type === 'add') {
            data['date'] = formatDate(true)
        }
        for (let i in params) {
            data[i] = params[i]
        }
        Toast.loading('保存中', 0)
        if (this.state._type === 'add') {
            mStore(`${this.props.match.params.model}`, data)
                .then(res => {
                    if (res.data.errors) {
                        res.data.errors.forEach(err => {
                            Toast.info(err.message, 1)
                        })
                    } else {
                        Toast.info('保存成功', 1, () => {
                            this.props.history.push('/home/work/summary')
                        })
                    }
                })
        } else if (this.state._type === 'edit') {
            mUpdate(`${this.props.match.params.model}/${this.state.id}`, data)
                .then(res => {
                    if (res.data.errors) {
                        res.data.errors.forEach(err => {
                            Toast.info(err.message, 1)
                        })
                    } else {
                        Toast.info('保存成功', 1, () => {
                            this.props.history.push('/home/work/summary')
                        })
                    }
                })
        }
    }
    titleValidator = (rule, value, callback) => {
        if (value === null) {
            callback('请输入标题')
        } else {
            if (String.trim(value).length < 5 || String.trim(value).length > 20) {
                callback('标题只能输入5至20')
            } else {
                callback()
            }
        }
    }
    render() {
        const {
            match,
            user,
        } = this.props
        const {
            summary
        } = this.state
        const formFields = [
            ({getFieldProps, getFieldError}) => (
                <InputItem
                    {...getFieldProps('title', {
                        initialValue: summary.title,
                        rules: [
                            {required: true, message: '请输入标题'},
                            { validator: this.titleValidator },
                        ]
                    })}
                    clear
                    error={!!getFieldError('title')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('title').join('、'), 1)
                    }}
                    placeholder="请输入标题"
                >
                    标题
                </InputItem>
            ),
            ({getFieldProps, getFieldError}) => (
                <TextareaItem
                    {...getFieldProps('content', {
                        initialValue: summary.content,
                        rules: [{required: true, message: '请输入工作日志'}]
                    })}
                    error={!!getFieldError('content')}
                    onErrorClick={() => {
                        Toast.info(getFieldError('content').join('、'), 1)
                    }}
                    rows={6}
                    placeholder="请输入总结内容"
                />
            ),
        ]
        return (
            <div>
                <CustomForm formFields={formFields} handleSubmit={this.handleSubmit} />
            </div>
        )
    }
}

export default SummaryDetail
