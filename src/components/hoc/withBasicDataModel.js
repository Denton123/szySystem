import React from 'react'
import {message} from 'antd'

// 自定义弹窗
import CustomPrompt from 'COMPONENTS/modal/CustomPrompt'

// 引入工具方法
import {valueToMoment, momentToValue, resetObject} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'
/**
 * [transformValue 表单值转换]
 * @Author   szh
 * @DateTime 2017-12-05
 * @param    {String}              field [表单字段]
 * @param    {str||num||bool}      value [当前值，可以是任何基本类型的值]
 * @return   {all}                       [返回所有类型的值]
 */
function transformValue(field, value) {
    if (value === null || value === undefined) return null
    let v
    if (field.indexOf('date') > -1) {
        // 日期组件的value必须使用moment
        v = valueToMoment(value)
    } else {
        v = value
    }
    return v
}
/**
 * Datas传值说明
 *
 * 影响state的属性
 * model               *后台模块名称                String    如'user'
 * subModel             index获取数据时的额外参数   Object    如asset下面的设备{belong: 'equipment'}、办公用品{belong: 'stationery'}、图书{belong: 'book'}
 * title               *页面名称(不用对话框可以不传)String    如'人员管理'
 * dataSetting          数据设置                    Object    具体参数请看antd表格、或者列表设置
 * modalSetting         对话框设置                  Object    具体参数请看antd对话框设置
 * queryFieldValues    *查询字段的值                Object    {name: {value: null}}
 * formFieldsValues    *表单字段的值                Object    {name: {value: null}, realname: {value: null}}
 *
 *  不影响state的属性
 * formSubmitHasFile   表单提交时是否有文件         Boolean   默认false(无文件)
 * handleData          数据特殊处理                 Function  无默认，部分页面的关联数据需要进行特殊处理(主要在index方法获取数据后)，不传入时，数据不进行处理
 * customGetData       自定义获取默认数据           Boolean   默认false()
 * clearFormValues     清空表单默认值               Bool||Obj 默认true(清空)  用于在表单提交后是否清空表单默认值，如果传入对象，则表单默认改变为传入对象
 * locationSearch      是否设置浏览器地址的search   Boolean   默认不设置      设置后，在浏览器获取index方法的数据后，浏览器地址会出现?page=n
 */
/**
 * [withBasicDataModel 混合基本数据处理的状态]
 * @Author   szh
 * @DateTime 2017-12-07
 * @param    {ReactNode}   PageComponent [页面组件]
 * @param    {Object}      Datas         [需要传的状态值]
 * @return   {ReactNode}                 [有页面状态的页面]
 */
function withBasicDataModel(PageComponent, Datas) {
    const dataSetting = Datas.dataSetting ? Datas.dataSetting : {} // 模块的数据设置
    const modalSetting = Datas.modalSetting ? Datas.modalSetting : {}
    const hasFile = Datas.formSubmitHasFile !== undefined ? Datas.formSubmitHasFile : false
    const customGetData = Datas.customGetData !== undefined ? Datas.customGetData : false
    const clearFormValues = Datas.clearFormValues !== undefined ? Datas.clearFormValues : {}
    const locationSearch = Datas.locationSearch !== undefined ? Datas.locationSearch : true
    const subModel = Datas.subModel !== undefined ? Datas.subModel : {}
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                model: Datas.model,
                title: Datas.title,
                // 表格设置
                dataSetting: {
                    ...dataSetting,
                    loading: true,
                    pagination: false,
                    dataSource: []
                },
                // 记录表格被选择的行
                tableRowSelection: [],
                // 操作类型 add 和 edit
                operationType: '',
                // 对话框设置
                modalSetting: {
                    ...modalSetting,
                    visible: false
                },
                // 查询字段的值
                queryFieldValues: Datas.queryFieldValues,
                // 表单字段的值
                formFieldsValues: Datas.formFieldsValues,
                // 表单提交
                isSubmitting: false,
                // 加载中
                loading: false,
            }
        }

        componentDidMount() {
            // 默认自动获取当前模块的列表数据
            if (!customGetData) {
                let page = this.props.location.state ? this.props.location.state.page : 1
                this.getData({page: page})
            }
        }

        /**
         * [自定义更新组件的]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {String}   stateFields [需要修改的状态名称state]
         * @param    {*}        stateValue  [修改状态的值]
         */
        handleSetState = (stateFields, stateValue) => {
            console.log('stateFields', stateFields)
            console.log('stateValue', stateValue)
            console.log('----------------------------------------------------')
            this.setState({
                [stateFields]: stateValue
            })
        }

        /**
         * [默认获取列表数据]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   params [index的参数]
         */
        getData = (params) => {
            if (Object.keys(subModel).length > 0) {
                Object.assign(params, subModel)
            }
            let data = {
                params: params
            }
            this.handleSetState('dataSetting', {
                ...this.state.dataSetting,
                loading: true
            })
            index(this.state.model, data)
                .then(res => {
                    let pagination = {
                        current: res.data.currentPage,
                        pageSize: res.data.pageSize,
                        total: res.data.total,
                        onChange: this.handlePageChange
                    }
                    // 数据特殊处理
                    let dataSource = Datas.handleData ? Datas.handleData(res.data.data) : res.data.data
                    console.log('dataSource', dataSource)
                    this.handleSetState('dataSetting', {
                        ...this.state.dataSetting,
                        loading: false,
                        pagination: pagination,
                        dataSource: dataSource
                    })
                    if (locationSearch) {
                        let search = '?'
                        for (let p in params) {
                            search += `${p}=${params[p]}&`
                        }
                        search = search.substr(0, search.length - 1)
                        this.props.history.push(`${this.props.location.pathname}${search}`, params)
                    } else {
                        this.props.history.push(`${this.props.location.pathname}`, params)
                    }
                })
        }

        /**
         * [表格翻页]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Number}   page [页数]
         */
        handlePageChange = (page) => {
            let params = {
                ...this.props.location.state, // 每个页面自己保存的状态
                page: page,
            }
            this.getData(params)
        }

        /**
         * [默认的新增按钮处理]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   e [Proxy，DOM的事件对象]
         */
        handleAdd = (e) => {
            console.log(e)
            this.handleSetState('operationType', 'add')
            this.handleSetState('modalSetting', {
                ...this.state.modalSetting,
                visible: true,
                title: `${this.state.title}-新增`
            })
        }

        /**
         * [表格行编辑数据获取]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   e  [Proxy，DOM的事件对象]
         * @param    {Function} cb [自定义回调函数，存在时，则执行回调函数，不执行默认处理]
         */
        handleEdit = (e, cb) => {
            console.log(e.target.dataset)
            this.handleSetState('operationType', 'edit')
            let id = e.target.dataset['id']
            show(`/${this.state.model}/${id}`)
                .then(res => {
                    if (cb) {
                        cb(res)
                    } else {
                        this.handleSetState('modalSetting', {
                            ...this.state.modalSetting,
                            visible: true,
                            title: `${this.state.title}-编辑`
                        })
                        this.updateEditFormFieldsValues(resetObject(res.data))
                    }
                })
        }

        /**
         * [编辑数据时更新表单数据]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   data [数据对象]
         */
        updateEditFormFieldsValues = (data) => {
            this.setState((prevState, props) => {
                let obj = {}
                Object.keys(prevState.formFieldsValues).forEach(field => {
                    obj[field] = {
                        value: transformValue(field, data[field])
                    }
                })
                console.log('oupdateEditFormFieldsValues ---- ')
                console.log(obj)
                return {
                    formFieldsValues: obj
                }
            })
        }

        /**
         * [表单提交处理 存在新增和编辑两种情况]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   values [表单提交的数据]
         * @param    {Function} cb     [description]
         */
        handleFormSubmit = (values, cb) => {
            this.handleSetState('isSubmitting', true)
            console.log('handleFormSubmit ------ ')
            console.log(values)
            if (this.state.operationType === 'add') {
                this.ajaxStore(values, cb)
            } else {
                this.ajaxUpdate(this.state.formFieldsValues.id.value, values, cb)
            }
        }

        /**
         * [ajax store的独立方法]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   params [ajax store的参数对象]
         * @param    {Function} cb     [回调，传入后则不会做默认处理]
         */
        ajaxStore = (params, cb) => {
            store(this.state.model, params, hasFile)
            .then(res => {
                this.handleSetState('isSubmitting', false)
                if (res.data.errors) {
                    res.data.errors.forEach(err => {
                        message.error(err.message)
                    })
                } else {
                    if (cb) {
                        cb(res)
                    } else {
                        // 新增后的默认处理
                        this.getData({page: 1})
                        this.handleModalCancel()
                        message.success('保存成功')
                    }
                }
            })
            .catch(err => {
                console.log(err)
                message.success('保存失败')
                this.handleSetState('isSubmitting', false)
            })
        }

        /**
         * [ajax update的独立方法]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Number}   id     [更新数据的id值]
         * @param    {Object}   params [ajax update的参数对象]
         * @param    {Function} cb     [回调，传入后则不会做默认处理]
         */
        ajaxUpdate = (id, params, cb) => {
            update(`${this.state.model}/${id}`, params, hasFile)
            .then(res => {
                this.handleSetState('isSubmitting', false)
                if (res.data.errors) {
                    res.data.errors.forEach(err => {
                        message.error(err.message)
                    })
                } else {
                    if (cb) {
                        cb(res)
                    } else {
                        // 编辑后的默认处理
                        this.setState((prevState, props) => {
                            let newDataSource = []
                            prevState.dataSetting.dataSource.forEach(data => {
                                if (data.id === prevState.formFieldsValues.id.value) {
                                    newDataSource.push(resetObject(res.data))
                                } else {
                                    newDataSource.push(data)
                                }
                            })
                            return {
                                dataSetting: {
                                    ...prevState.dataSetting,
                                    dataSource: newDataSource
                                }
                            }
                        })
                        this.handleModalCancel()
                        message.success('保存成功')
                    }
                }
            })
            .catch(err => {
                console.log(err)
                message.success('保存失败')
                this.handleSetState('isSubmitting', false)
            })
        }

        /**
         * [表单对话框取消回调]
         * @Author   szh
         * @DateTime 2017-12-19
         */
        handleModalCancel = () => {
            this.setState((prevState, props) => {
                let obj = {}
                if (Object.keys(clearFormValues).length > 0) { // 根据clearFormValues来设置表单默认值
                    for (let i in clearFormValues) {
                        obj[i] = {
                            value: clearFormValues[i].value
                        }
                    }
                } else {
                    for (let i in prevState.formFieldsValues) {
                        obj[i] = {
                            value: null
                        }
                    }
                }
                return {
                    formFieldsValues: obj,
                }
            })
            this.handleSetState('isSubmitting', false)
            this.handleSetState('modalSetting', {
                ...this.state.modalSetting,
                visible: false,
                title: `${this.state.title}`
            })
        }

        /**
         * [单个删除]
         * @Author   szh
         * @DateTime 2017-12-19
         * @param    {Object}   e [Proxy.event事件]
         */
        handleDelete = (e) => {
            let id = e.target.dataset['id']
            CustomPrompt({
                type: 'confirm',
                content: <div>是否要删除这条信息</div>,
                okType: 'danger',
                onOk: () => {
                    destroy(`${this.state.model}/${id}`)
                        .then(res => {
                            let { dataSource } = this.state.dataSetting
                            dataSource.splice(
                                dataSource.findIndex(item => item.id === res.data.id),
                                1
                            )
                            this.handleSetState('dataSetting', {
                                ...this.state.dataSetting,
                                dataSource: dataSource
                            })
                        })
                }
            })
        }

        // 表格checkbox选择时调用
        handleTableRowChange = (selectedRowKeys, selectedRows) => {
            this.setState({
                tableRowSelection: selectedRowKeys
            })
        }

        // 批量删除
        handleBatchDelete = (e) => {
            console.log('=========')
            if (this.state.tableRowSelection.length === 0) {
                message.warning('至少要选择一条数据')
                return
            }
            CustomPrompt({
                type: 'confirm',
                content: <div>{`是否要删除这${this.state.tableRowSelection.length}条数据`}</div>,
                okType: 'danger',
                onOk: () => {
                    ajax('post', `/api/${this.state.model}/batch-delete`, {ids: this.state.tableRowSelection})
                        .then(res => {
                            this.setState({
                                dataSetting: {
                                    ...this.state.dataSetting,
                                    dataSource: res.data
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
        }

        // 处理查询
        handleQuery = () => {
            let params = {}
            for (let i in this.state.queryFieldValues) {
                if (this.state.queryFieldValues[i].value !== null) {
                    if (i.indexOf('date') > -1) {
                        params[i] = momentToValue(this.state.queryFieldValues[i].value)
                    } else if (i.indexOf('price') > -1) {
                        let arr = []
                        Object.keys(this.state.queryFieldValues[i].value).forEach((key) => {
                            // params[key] = this.state.queryFieldValues[i].value[key]
                            if (this.state.queryFieldValues[i].value[key]) {
                                arr.push(this.state.queryFieldValues[i].value[key])
                            }
                        })
                        params[i] = arr
                    } else {
                        params[i] = this.state.queryFieldValues[i].value
                    }
                }
            }
            console.log(params)
            if (Object.keys(params).length === 0) {
                message.warning('请增加查询条件')
                return
            }
            params['page'] = 1
            this.getData(params, false)
        }

        // 更新表单数据
        updateFormFields = (changedFields) => {
            console.log(this.state.formFieldsValues)
            this.setState({
                formFieldsValues: {...this.state.formFieldsValues, ...changedFields}
            })
        }

        // 更新查询表单数据
        updateQueryFields = (changedFields) => {
            this.setState({
                queryFieldValues: {...this.state.queryFieldValues, ...changedFields}
            })
        }

        // // 人事管理的评论
        // handleComment = (e) => {
        //     this.handleOperationType('comment')
        //     let id = e.target.dataset['id']
        //     show(`/${this.state.model}/${id}`)
        //         .then(res => {
        //             this.handleModalSetting(true, `${this.state.title}-评论`)
        //             this.updateEditFormFieldsValues(resetObject(res.data))
        //         })
        // }

        // // 人事管理的通过
        // handlePass = (id, cb) => {
        //     return (text) => {
        //         let values = {
        //             pass: Number(text)
        //         }
        //         update(`${this.state.model}/${id}`, values, hasFile).then(res => {
        //             this.handleSubmitStatus(false)
        //             if (res.data.errors) {
        //                 res.data.errors.forEach(err => {
        //                     message.error(err.message)
        //                 })
        //             } else {
        //                 // 编辑后的处理
        //                 this.setState((prevState, props) => {
        //                     let newDataSource = []
        //                     prevState.dataSetting.dataSource.forEach(data => {
        //                         if (data.id === id) {
        //                             newDataSource.push(resetObject(res.data))
        //                         } else {
        //                             newDataSource.push(data)
        //                         }
        //                     })
        //                     return {
        //                         dataSetting: {
        //                             ...prevState.dataSetting,
        //                             dataSource: newDataSource
        //                         }
        //                     }
        //                 })
        //                 message.success(this.state.operationType === 'comment' ? '评论成功！' : '保存成功！')
        //                 cb && cb(res)
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err)
        //             message.success('保存失败！')
        //             this.handleSubmitStatus(false)
        //         })
        //     }
        // }

        render() {
            return (
                <PageComponent
                    getData={this.getData}
                    handleSetState={this.handleSetState}
                    handlePageChange={this.handlePageChange}
                    handleAdd={this.handleAdd}
                    handleEdit={this.handleEdit}
                    updateEditFormFieldsValues={this.updateEditFormFieldsValues}
                    handleFormSubmit={this.handleFormSubmit}
                    ajaxStore={this.ajaxStore}
                    ajaxUpdate={this.ajaxUpdate}
                    handleModalCancel={this.handleModalCancel}
                    handleDelete={this.handleDelete}
                    handleTableRowChange={this.handleTableRowChange}
                    handleBatchDelete={this.handleBatchDelete}
                    handleQuery={this.handleQuery}
                    updateFormFields={this.updateFormFields}
                    updateQueryFields={this.updateQueryFields}
                    {...this.state}
                    {...this.props}
                />
            )
        }
    }
}

module.exports = withBasicDataModel
