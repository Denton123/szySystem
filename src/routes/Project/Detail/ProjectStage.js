import React, {Component} from 'react'
import {
    Card,
    Button,
    Spin,
    Input,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import './ProjectDetail.less'

// 引入工具方法
import {resetObject} from 'UTILS/utils'
import {ajax, index, store, update} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDynamicForm from 'COMPONENTS/form/CustomDynamicForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const {Meta} = Card

class ProjectStage extends Component {
    state = {
        // 页面加载
        loading: true,
        // 动态表单key值
        dynamicKeys: [],
        key: 0,
        // 阶段tab
        stageTabs: [],
        currentStageTabs: '',

        formFieldsValues: {}
    }

    componentDidMount() {
        this.getStage()
            .then(res => {
                this.setState({
                    loading: false,
                })
                this.handleStageTabs(res.data)
            })
    }

    getStage = () => {
        let params = {
            project_id: this.props.id
        }
        return index('stage', {params: params})
    }

    handleSubmit = (values) => {
        console.log(values)
        this.props.handleSubmitStatus(true)
        let data = []
        if (this.props.operationType === 'add') {
            let key = `t${Date.now()}-u${this.props.user.id}-i`
            values.keys.forEach((k, i, arr) => {
                let obj = {
                    project_id: parseInt(this.props.id),
                    name: values[`name-${k}`],
                    key: `${key}${i}`,
                    prev_key: i === 0 ? 0 : `${key}${i - 1}`,
                    next_key: i === arr.length - 1 ? 0 : `${key}${i + 1}`
                }
                data.push(obj)
            })
        } else {
            console.log(this.state.formFieldsValues)
        }
        console.log(data)
        // let submit = this.props.operationType === 'add'
        //         ? store('stage', data, false)
        //         : update(`stage/${this.props.id}`, data, false)
        // submit
        //     .then(res => {
        //         this.props.handleSubmitStatus(false)
        //         if (res.data.errors) {
        //             res.data.errors.forEach(err => {
        //                 message.error(err.message)
        //             })
        //         } else {
        //             if (this.state.operationType === 'add') {
        //             // 新增后的处理
        //                 this.handleStageTabs(res.data)
        //             } else {
        //             // 编辑后的处理
        //             }
        //             // this.props.handleModalCancel()
        //             message.success('保存成功')
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         message.success('保存失败')
        //         this.handleSubmitStatus(false)
        //     })
    }

    handleModalCancel = () => {
        this.props.handleModalCancel()
        this.clearDynamicKeys()
    }

    // 设置tabs标签
    handleStageTabs = (data) => {
        let arr = []
        let currentStageTabs = ''
        data.forEach((d, i) => {
            if (i === 0) {
                currentStageTabs = d.name
            }
            let obj = {
                key: d.name,
                tab: d.name
            }
            arr.push(obj)
        })
        this.setState({
            stageTabs: arr,
            currentStageTabs: currentStageTabs,
        })
    }

    // 项目阶段编辑
    handleEdit = (e) => {
        this.props.handleOperationType('edit')
        this.getStage()
            .then(res => {
                console.log(res)
                let arr = []
                let obj = {}
                res.data.forEach((d, i) => {
                    arr.push(i)
                    for (let j in d) {
                        obj[`${j}-${i}`] = {
                            value: d[j],
                        }
                    }
                })
                this.setDynamicKeys(arr.length, arr)
                this.props.handleModalSetting(true, '项目阶段-编辑')
                this.setState({
                    formFieldsValues: obj
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 切换tabs
    onTabChange = (key) => {
        this.setState({
            currentStageTabs: key
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

    updateFormFields = (changedFields) => {
        this.setState({
            formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
        })
    }

    render() {
        const {
            route,
            history,
            location,
            match
        } = this.props

        const state = this.state

        // 动态表单设置对象
        const formFields = [
            {
                label: '阶段名称',
                field: 'name',
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                    {required: true, message: '请输入阶段名称'},
                    {max: 6, min: 2, message: '阶段名称长度为2~6个字符'}
                ],
                component: (<Input style={{width: '80%'}} autoComplete="off" placeholder="阶段名称" />),
            },
        ]

        return (
            <Spin spinning={state.loading} tip="正在加载项目信息...">
                <div className="w100 mt-10">
                    {state.stageTabs.length > 0 ? (
                        <Card
                            style={{ width: '100%' }}
                            extra={<Button type="primary" onClick={this.handleEdit} >编辑</Button>}
                            title={state.currentStageTabs}
                            tabList={state.stageTabs}
                            onTabChange={(key) => { this.onTabChange(key) }}
                        >
                            <div>a</div>
                        </Card>
                    ) : (
                        <Card
                            style={{ width: '100%' }}
                            title={'本项目暂无阶段'}
                            extra={
                                <Button type="primary" className="pull-right" onClick={this.props.handleAdd} >增加</Button>
                            }
                        />
                    )}
                    <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.handleModalCancel} width={780}>
                        <CustomDynamicForm
                            handleSubmit={this.handleSubmit}
                            formFields={formFields}
                            formFieldsValues={state.formFieldsValues}
                            updateFormFields={this.updateFormFields}
                            isSubmitting={this.props.isSubmitting}
                            dynamicKeys={state.dynamicKeys}
                            dynamicAdd={this.dynamicAdd}
                            dynamicRemove={this.dynamicRemove}
                        />
                    </CustomModal>
                </div>
            </Spin>
        )
    }
}

const PS = withBasicDataModel(ProjectStage, {
    model: 'stage',
    title: '项目阶段',
    customGetData: true
})

export default PS
