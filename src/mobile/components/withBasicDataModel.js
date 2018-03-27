import React from 'react'
import {
    Toast
} from 'antd-mobile'

import { isArray, isObject } from 'UTILS/utils'
import { mIndex } from 'UTILS/ajax'

function withBasicDataModel(PageComponent, Datas) {
    let subModel = Datas.subModel !== undefined ? Datas.subModel : {}
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                model: Datas.model,
                // 列表设置
                dateSetting: {
                    dataSource: [],
                    pagination: {
                        current: 1,
                        pageSize: 0,
                        total: 0
                    },
                    // 列表下拉刷新
                    refreshing: false
                }
            }
        }

        componentDidMount() {
            // this.getData()
            console.log('withBasicDataModel.js')
            console.log(this.props.location)
            if (this.props.location && this.props.location.state && this.props.location.state.page) {
                let current = this.props.location.state.page
                this.setState(prevState => {
                    let pagination = prevState.dateSetting.pagination
                    pagination['current'] = current
                    return {
                        dateSetting: {
                            ...prevState.dateSetting,
                            pagination: pagination
                        }
                    }
                })
            }
        }

        // 获取数据(请求的参数 Object，过滤的参数Array, 成功获取数据后的回调Function, 自定义获取数据方法)
        getData = (params, resetFilterArr, cb, getDataCb) => {
            let p = {} // 用来装locationState 和传过来的参数params,过滤后的resetFilterArr
            let locationState = {}
            if (this.props.location.state) {
                locationState = this.props.location.state
                p = locationState
            }
            // 判断有参数
            if (params) {
                p = {...p, ...params}
            }
            let resetfilterParams = {}
            // 重置需要过滤的字段，过滤完后存储到state的，把查找过的字段清除
            if (resetFilterArr) {
                Object.keys(p).forEach(key => {
                    if (resetFilterArr.indexOf(key) < 0) {
                        resetfilterParams[key] = p[key]
                    }
                })
                p = resetfilterParams
            }
            console.log('resetfilterParams p---')
            console.log(p)
            this.props.history.replace(`${this.props.location.pathname}`, p)
            Toast.loading('正在加载...', 0)
            if (this.props.user) {
                const id = this.props.user.id
                params = { page: 1, ...p }
                if (Object.keys(subModel).length > 0) {
                    Object.assign(params, subModel)
                }
                // 参数需要过滤掉的字段，过滤完后用于请求数据的
                let filterArr = ['tabIndex']
                let filterParams = {}
                Object.keys(params).forEach(key => {
                    if (filterArr.indexOf(key) < 0) {
                        filterParams[key] = params[key]
                    }
                })
                console.log('getData---')
                console.log('params:')
                console.log(params)
                console.log('filterParams:')
                console.log(filterParams)
                if (getDataCb) {
                    getDataCb()
                } else {
                    mIndex(this.state.model, filterParams)
                    .then(res => {
                        Toast.hide()
                        let pagination = {
                            current: res.data.currentPage,
                            pageSize: res.data.pageSize,
                            total: res.data.totalPage
                        }
                        this.setState(prevState => {
                            return {
                                dateSetting: {
                                    ...prevState.dateSetting,
                                    dataSource: res.data.data,
                                    pagination: pagination
                                }
                            }
                        })
                        if (cb) {
                            cb()
                        }
                    })
                    .catch(e => {
                        console.log(222)
                        Toast.hide()
                        Toast.fail('请求失败', 1)
                    })
                }
            }
        }

        // 自定义更新组件的state
        handleSetState = (stateFields, stateValue) => {
            this.setState({
                [stateFields]: stateValue
            })
        }

        // 表格翻页(页数)
        handlePageChange = (e) => {
            let params = {
                page: e
            }
            this.handleSetState('dateSetting', {
                ...this.state.dateSetting,
                pagination: {
                    ...this.state.dateSetting.pagination,
                    current: e
                }
            })
            console.log('handlePageChange --- ')
            console.log(params)
            this.getData(params)
        }

        // 搜索栏提交处理(search表单)
        handleSearchSubmit = (searchFields, resetFilterArr = []) => {
            console.log('withBasicDataModel handleSearchSubmit --- ')
            console.log(searchFields)
            console.log(resetFilterArr)
            // 判断是否所以字段都是 undefined
            let isAllUndefined = true
            let params = {}
            Object.keys(searchFields).forEach(key => {
                if (searchFields[key] === undefined) {
                    isAllUndefined = isAllUndefined && true
                } else {
                    isAllUndefined = isAllUndefined && false
                    params[key] = searchFields[key]
                }
            })
            if (isAllUndefined) {
                Toast.info('请输入搜索内容', 1)
                return
            }
            params['page'] = 1
            this.getData(params, resetFilterArr)
        }

        // 搜索栏重置(提交的表单数据，重置不需要过滤的字段)
        handleSearchReset = (e, resetNotFilter = []) => {
            console.log('handleSearchReset')
            console.log(resetNotFilter)
            let resetArr = isObject(e) ? Object.keys(e) : []
            resetNotFilter.forEach(item => {
                resetArr.splice(resetArr.indexOf(item), 1)
            })
            console.log(resetArr)
            this.getData({page: 1}, resetArr)
        }

        // 下拉刷新
        bandleDownRefresh = () => {
            this.handleSetState('dateSetting', {
                ...this.state.dateSetting,
                refreshing: true
            })
            this.getData({}, [], () => {
                this.handleSetState('dateSetting', {
                    ...this.state.dateSetting,
                    refreshing: false
                })
            })
        }

        render() {
            return (
                <div>
                    <PageComponent
                        getData={this.getData}
                        handleSetState={this.handleSetState}
                        handlePageChange={this.handlePageChange}
                        handleSearchSubmit={this.handleSearchSubmit}
                        handleSearchReset={this.handleSearchReset}
                        bandleDownRefresh={this.bandleDownRefresh}
                        toastHide={this.toastHide}
                        {...this.state}
                        {...this.props}
                    />
                </div>
            )
        }
    }
}

module.exports = withBasicDataModel
