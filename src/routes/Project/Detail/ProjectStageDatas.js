import React, {Component} from 'react'
import {
    Card,
    Input,
    Button,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './ProjectStageDatas.less'

// 引入工具方法
import {isString, isObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomDynamicForm from 'COMPONENTS/form/CustomDynamicForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

/**
 * [ObjOrStrTransfrom 把json字符串转成对象或者将json对象转成字符串]
 * @Author   szh
 * @DateTime 2017-12-14
 * @param     {Obj||Str}   data [json对话或json字符串]
 * @return    {Obj||Str}        [json对话或json字符串]
 */
function ObjOrStrTransfrom(data) {
    if (isString(data)) {
        return JSON.parse(data)
    } else if (isObject(data)) {
        return JSON.stringify(data)
    }
}

class ProjectStageDatas extends Component {
    state = {
        // 动态表单key值
        dynamicKeys: [],
        key: 0,

        // 当前阶段的详细信息
        stageData: {}
    }

    componentDidMount() {
        this.props.handleSetState('modalSetting', {
            ...this.props.modalSetting,
            visible: false,
            title: `${this.props.stage.name}`
        })
        if (this.props.stage.data !== null) {
            this.setStageData(ObjOrStrTransfrom(this.props.stage.data))
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     console.log(prevProps)
    //     console.log(prevState)
    //     if (prevProps.stage.data !== null) {
    //         this.setStageData(ObjOrStrTransfrom(prevProps.stage.data))
    //     }
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log(nextProps)
    //     console.log(nextState)
    //     if (nextProps.stage.data !== null) {
    //         this.setStageData(ObjOrStrTransfrom(nextProps.stage.data))
    //     }
    //     return true
    // }

    // componentWillUpdate(nextProps, nextState) {
    //     console.log(nextProps)
    //     console.log(nextState)
    //     if (nextProps.stage.data !== null) {
    //         this.setStageData(ObjOrStrTransfrom(nextProps.stage.data))
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        if (nextProps.stage.data !== null) {
            this.setStageData(ObjOrStrTransfrom(nextProps.stage.data))
        } else {
            this.setStageData({})
        }
    }

    getStageData = (id) => {
        return ajax('get', `/stage/get-data/${id}`)
    }

    setStageData = (data) => {
        this.setState({
            stageData: data
        })
    }

    handleSubmit = (values) => {
        if (values.keys.length === 0) {
            message.warning('请添加项目阶段')
            return false
        }
        this.props.handleSetState('isSubmitting', true)
        let data = {}
        values.keys.forEach(k => {
            data[values[`name-${k}`]] = values[`info-${k}`]
        })
        data = ObjOrStrTransfrom(data)
        ajax('post', `/stage/set-data/${this.props.stage.id}`, {data: data})
            .then(res => {
                this.props.handleSetState('isSubmitting', false)
                this.props.setAllStageData(this.props.stage.id, res.data.data)
                this.props.handleModalCancel()
                message.success('保存成功')
            })
            .catch(err => {
                this.props.handleSetState('isSubmitting', false)
                message.success('保存失败')
                console.log(err)
            })
    }

    handleModalCancel = () => {
        this.props.handleModalCancel()
        this.clearDynamicKeys()
    }

    handleEdit = (e) => {
        this.props.handleSetState('operationType', 'edit')
        this.getStageData(this.props.stage.id)
            .then(res => {
                let data = ObjOrStrTransfrom(res.data.data)
                let arr = []
                let obj = {}
                let j = 0
                for (let i in data) {
                    obj[`name-${j}`] = {
                        value: i
                    }
                    obj[`info-${j}`] = {
                        value: data[i]
                    }
                    arr.push(j)
                    j++
                }
                this.setDynamicKeys(arr.length, arr)
                this.props.handleSetState('formFieldsValues', obj)
                this.props.handleSetState('modalSetting', {
                    ...this.props.modalSetting,
                    visible: true,
                    title: `设置${this.props.stage.name}详细信息`
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 新增动态表单一项
    dynamicAdd = () => {
        this.setState((prevState, props) => {
            prevState.key++
            prevState.dynamicKeys.push(prevState.key)
            return {
                key: prevState.key,
                dynamicKeys: prevState.dynamicKeys
            }
        })
    }

    // 移除动态表单一项
    dynamicRemove = (k) => {
        let dynamicKeys = this.state.dynamicKeys
        if (dynamicKeys.length === 1) {
            return
        }
        this.setState({
            dynamicKeys: dynamicKeys.filter(key => key !== k),
        })
    }

    // 清除动态表单
    clearDynamicKeys = () => {
        this.setDynamicKeys(0, [])
    }

    /**
     * [设置动态表单的keys]
     * @Author   szh
     * @DateTime 2017-12-13
     * @param    {number}   len [当前动态值的长度]
     * @param    {array}    arr [动态值key数组]
     */
    setDynamicKeys = (len, arr) => {
        this.setState({
            key: len,
            dynamicKeys: arr
        })
    }

    render() {
        const {
            stage
        } = this.props
        const state = this.state

        // 动态表单设置对象
        const formFields = [
            {
                label: '名称',
                field: 'name',
                valid: {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {required: true, message: '请输入名称，如“阶段负责人”'},
                    ],
                },
                component: (<Input style={{width: '80%'}} autoComplete="off" placeholder="名称" />),
            },
            {
                label: '具体信息',
                field: 'info',
                valid: {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {required: true, message: '请输入具体信息，如“张三、李四”'},
                    ],
                },
                component: (<Input style={{width: '80%'}} autoComplete="off" placeholder="具体信息" />),
            },
        ]

        return (
            <div className="w100 mt-10">
                <Card
                    type="inner"
                    title={`${stage.name}-详细信息`}
                    loading={state.loading}
                    extra={<Button type="primary" className="pull-right" onClick={this.handleEdit} >设置详细信息</Button>}
                >
                    {isObject(state.stageData) && Object.keys(state.stageData).length > 0 ? (
                        <ul className="clearfix data">
                            {Object.keys(state.stageData).map((name, i) => (
                                <li className="pull-left" key={i}>
                                    <span>{name}：</span>
                                    <span>{state.stageData[name]}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        '暂无详细信息'
                    )}
                </Card>
                <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.handleModalCancel} width={780}>
                    <CustomDynamicForm
                        handleSubmit={this.handleSubmit}
                        formFields={formFields}
                        formFieldsValues={this.props.formFieldsValues}
                        updateFormFields={this.props.updateFormFields}
                        isSubmitting={this.props.isSubmitting}
                        dynamicKeys={state.dynamicKeys}
                        dynamicAdd={this.dynamicAdd}
                        dynamicRemove={this.dynamicRemove}
                    />
                </CustomModal>
            </div>
        )
    }
}

const PSD = withBasicDataModel(ProjectStageDatas, {
    model: 'stage',
    formFieldsValues: {},
    customGetData: true
})

export default PSD
