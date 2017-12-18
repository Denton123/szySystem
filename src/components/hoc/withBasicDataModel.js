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
 * subModel             子模块名                    String    如asset下面的'equipment'设备、'stationery'办公用品、'book'图书'
 * title               *页面名称(不用对话框可以不传)String    如'人员管理'
 * tableSetting         表格设置                    Object    具体参数请看antd表格设置
 * modalSetting         对话框设置                  Object    具体参数请看antd对话框设置
 * queryFieldValues    *查询字段的值                Object    {name: {value: null}}
 * formFieldsValues    *表单字段的值                Object    {name: {value: null}, realname: {value: null}}
 *
 *  不影响state的属性
 * formSubmitHasFile   表单提交时是否有文件         Boolean   默认false(无文件)
 * handleTableData     表格数据特殊处理             Function  无默认，部分页面的关联数据需要进行特殊处理(主要在index方法获取数据后)，不传入时，表格数据不进行处理
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
    const tableSetting = Datas.tableSetting ? Datas.tableSetting : {}
    const modalSetting = Datas.modalSetting ? Datas.modalSetting : {}
    const hasFile = Datas.formSubmitHasFile !== undefined ? Datas.formSubmitHasFile : false
    const customGetData = Datas.customGetData !== undefined ? Datas.customGetData : false
    const clearFormValues = Datas.clearFormValues !== undefined ? Datas.clearFormValues : true
    const locationSearch = Datas.locationSearch !== undefined ? Datas.locationSearch : false
    const subModel = Datas.subModel !== undefined ? Datas.subModel : ''
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                model: Datas.model,
                title: Datas.title,
                // 表格设置
                tableSetting: {
                    ...tableSetting,
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
            if (!customGetData) {
                let page = this.props.location.state ? this.props.location.state.page : 1
                this.getData({page: page}, true)
            }
        }

        // 获取列表数据
        getData = (params, first = false) => {
            if (subModel) {
                Object.assign(params, {belong: subModel})
            }
            let data = {
                params: params
            }
            this.setState({
                tableSetting: {
                    ...this.state.tableSetting,
                    loading: true
                }
            })
            index(this.state.model, data)
                .then(res => {
                    let pagination = {
                        current: res.data.currentPage,
                        pageSize: res.data.pageSize,
                        total: res.data.total,
                        onChange: this.handlePageChange
                    }
                    let dataSource = Datas.handleTableData ? Datas.handleTableData(res.data.data) : res.data.data
                    this.setState({
                        tableSetting: {
                            ...this.state.tableSetting,
                            loading: false,
                            pagination: pagination,
                            dataSource: dataSource
                        }
                    })
                    if (locationSearch) {
                        this.props.history.push(`${this.props.location.pathname}?page=${params.page}`, {page: params.page})
                    }
                })
        }

        // 表格翻页
        handlePageChange = (page) => {
            this.getData({page: page})
        }

        // 设置当前操作类型
        handleOperationType = (type) => {
            this.setState({
                operationType: type
            })
        }

        // 设置对话框状态
        handleModalSetting = (visible, title) => {
            this.setState({
                modalSetting: {
                    ...this.state.modalSetting,
                    visible: visible,
                    title: title
                },
            })
        }

        // 新增
        handleAdd = (e) => {
            console.log(e)
            this.handleOperationType('add')
            this.handleModalSetting(true, `${this.state.title}-新增`)
        }

        // 表格行编辑数据获取
        handleEdit = (e) => {
            console.log(e.target.dataset)
            this.handleOperationType('edit')
            let id = e.target.dataset['id']
            show(`/${this.state.model}/${id}`)
                .then(res => {
                    this.handleModalSetting(true, `${this.state.title}-编辑`)
                    this.updateEditFormFieldsValues(resetObject(res.data))
                })
        }

        // 编辑数据时更新表单数据
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

        // 设置表单提交状态
        handleSubmitStatus = (status) => {
            this.setState({
                isSubmitting: status
            })
        }

        // 表单提交回调 存在新增和编辑两种情况
        // 新增回调函数
        handleFormSubmit = (values, cb) => {
            this.handleSubmitStatus(true)
            console.log('handleFormSubmit ------ ')
            console.log(values)
            let submit = this.state.operationType === 'add'
                ? store(this.state.model, values, hasFile)
                : update(`${this.state.model}/${this.state.formFieldsValues.id.value}`, values, hasFile)
            submit
            .then(res => {
                this.handleSubmitStatus(false)
                if (res.data.errors) {
                    res.data.errors.forEach(err => {
                        message.error(err.message)
                    })
                } else {
                    if (this.state.operationType === 'add') {
                    // 新增后的处理
                        this.getData({page: 1})
                    } else {
                    // 编辑后的处理
                        this.setState((prevState, props) => {
                            let newDataSource = []
                            prevState.tableSetting.dataSource.forEach(data => {
                                if (data.id === prevState.formFieldsValues.id.value) {
                                    newDataSource.push(resetObject(res.data))
                                } else {
                                    newDataSource.push(data)
                                }
                            })
                            return {
                                tableSetting: {
                                    ...prevState.tableSetting,
                                    dataSource: newDataSource
                                }
                            }
                        })
                    }
                    this.handleModalCancel()
                    message.success(this.state.operationType === 'comment' ? '评论成功！' : '保存成功！')
                    cb && cb(res)
                }
            })
            .catch(err => {
                console.log(err)
                message.success('保存失败！')
                this.handleSubmitStatus(false)
            })
        }

        // 表单对话框取消回调
        handleModalCancel = (e) => {
            if (clearFormValues) {
                this.setState((prevState, props) => {
                    let obj = {}
                    if (!Object.keys(clearFormValues).length) {
                        for (let i in prevState.formFieldsValues) {
                            obj[i] = {
                                value: null
                            }
                        }
                    } else {
                        for (let i in clearFormValues) {
                            obj[i] = {
                                value: clearFormValues[i].value
                            }
                        }
                    }
                    return {
                        formFieldsValues: obj,
                    }
                })
            }
            this.handleSubmitStatus(false)
            this.handleModalSetting(false, `${this.state.title}`)
        }

        // 表格行删除
        handleDelete = (e) => {
            let id = e.target.dataset['id']
            CustomPrompt({
                type: 'confirm',
                content: <div>是否要删除这条信息</div>,
                okType: 'danger',
                onOk: () => {
                    destroy(`${this.state.model}/${id}`)
                        .then(res => {
                            let { dataSource } = this.state.tableSetting
                            dataSource.splice(
                                dataSource.findIndex(item => item.id === res.data.id),
                                1
                            )
                            this.setState({
                                tableSetting: {
                                    ...this.state.tableSetting,
                                    dataSource: dataSource
                                }
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
                                tableSetting: {
                                    ...this.state.tableSetting,
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
        handleQuery = (e) => {
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

        // 设置formFieldsValues的状态
        handleFormFieldsValues = (obj) => {
            this.setState({
                formFieldsValues: obj
            })
        }

        // 设置loading状态
        handleLoading = (loadingState) => {
            this.setState({
                loading: loadingState
            })
        }

        // 人事管理的评论
        handleComment = (e) => {
            this.handleOperationType('comment')
            let id = e.target.dataset['id']
            show(`/${this.state.model}/${id}`)
                .then(res => {
                    this.handleModalSetting(true, `${this.state.title}-评论`)
                    this.updateEditFormFieldsValues(resetObject(res.data))
                })
        }

        // 人事管理的通过
        handlePass = (id, cb) => {
            return (text) => {
                let values = {
                    pass: Number(text)
                }
                update(`${this.state.model}/${id}`, values, hasFile).then(res => {
                    this.handleSubmitStatus(false)
                    if (res.data.errors) {
                        res.data.errors.forEach(err => {
                            message.error(err.message)
                        })
                    } else {
                        // 编辑后的处理
                        this.setState((prevState, props) => {
                            let newDataSource = []
                            prevState.tableSetting.dataSource.forEach(data => {
                                if (data.id === id) {
                                    newDataSource.push(resetObject(res.data))
                                } else {
                                    newDataSource.push(data)
                                }
                            })
                            return {
                                tableSetting: {
                                    ...prevState.tableSetting,
                                    dataSource: newDataSource
                                }
                            }
                        })
                        message.success(this.state.operationType === 'comment' ? '评论成功！' : '保存成功！')
                        cb && cb(res)
                    }
                })
                .catch(err => {
                    console.log(err)
                    message.success('保存失败！')
                    this.handleSubmitStatus(false)
                })
            }
        }

        render() {
            return (
                <PageComponent
                    getData={this.getData}
                    handlePageChange={this.handlePageChange}
                    handleOperationType={this.handleOperationType}
                    handleAdd={this.handleAdd}
                    handleEdit={this.handleEdit}
                    handleComment={this.handleComment}
                    handlePass={this.handlePass}
                    updateEditFormFieldsValues={this.updateEditFormFieldsValues}
                    handleSubmitStatus={this.handleSubmitStatus}
                    handleFormSubmit={this.handleFormSubmit}
                    handleModalCancel={this.handleModalCancel}
                    handleModalSetting={this.handleModalSetting}
                    handleDelete={this.handleDelete}
                    handleTableRowChange={this.handleTableRowChange}
                    handleBatchDelete={this.handleBatchDelete}
                    handleQuery={this.handleQuery}
                    updateFormFields={this.updateFormFields}
                    updateQueryFields={this.updateQueryFields}
                    handleFormFieldsValues={this.handleFormFieldsValues}
                    handleLoading={this.handleLoading}
                    {...this.state}
                    {...this.props}
                />
            )
        }
    }
}

module.exports = withBasicDataModel
