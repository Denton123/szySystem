import React from 'react'
import {
    Toast
} from 'antd-mobile'

import { isArray, isNullObject } from 'UTILS/utils'
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
                },
                // 搜索表单
                searchFields: {}
            }
        }

        componentWillMount() {
            console.log('withBasicDataModel.js ------ ')
        }

       /*
       获取数据(
            请求的参数                       Object
            新增在当前的的state              Object
            请求时需要过滤的字段,            Array
            成功获取数据后的回调Function,    Function
            自定义获取数据方法               Function
        )
        */
        getData = (params = {}, setState = {}, filter = [], cb, getDataCb) => {
            console.log('getData ---- ')
            console.log(params)
            console.log(setState)
            console.log(filter)
            let p = { page: 1 }         // 用来存储当前的state，新增在当前的的state, 请求的参数，需要查询表单，还有Datas.subModel，作于请求数据的data
            let locationState = {}      // 用来存储新的state，用于更新当前location的state
            // 存储当前页的state
            if (this.props.location.state) {
                locationState = this.props.location.state
                p = {...p, ...locationState}
            }
            // 存储新增在当前的的state
            if (isNullObject(setState)) {
                p = {...p, ...setState}
                locationState = p
            }
            console.log('locationState')
            console.log(locationState)
            // 存储请求的参数
            if (isNullObject(params)) {
                p = {...p, ...params}
            }
            // 存储需要查询表单
            if (isNullObject(this.state.searchFields)) {
                p = {...p, ...this.state.searchFields}
            }
            console.log('p---')
            console.log(p)
            this.props.history.replace(`${this.props.location.pathname}`, locationState)
            Toast.loading('正在加载...', 0)
            if (this.props.user) {
                const id = this.props.user.id
                if (isNullObject(subModel)) {
                    Object.assign(p, subModel)
                }
                // 参数需要过滤掉的字段，过滤完后用于请求数据的
                let filterArr = ['tabIndex']
                // filterArr合并filter
                if (filter.length > 0) {
                    filterArr = [...filterArr, ...filter]
                }
                console.log('filterArr:')
                console.log(filterArr)
                let filterP = {}
                // 过滤掉不需要请求的参数
                Object.keys(p).forEach(key => {
                    if (filterArr.indexOf(key) < 0) {
                        filterP[key] = p[key]
                    }
                })
                console.log('filterP:')
                console.log(filterP)
                if (getDataCb) {
                    getDataCb()
                } else { // 默认走这里
                    mIndex(this.state.model, filterP)
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
            this.getData(params)
        }

        // 搜索栏提交处理(search表单)
        handleSearchSubmit = (searchFields, filter = []) => {
            console.log('withBasicDataModel handleSearchSubmit --- ')
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
            this.setState({
                searchFields: searchFields
            }, () => {
                this.getData({page: 1}, {}, filter)
            })
        }

        // 搜索栏重置(提交的表单数据，重置不需要过滤的字段)
        handleSearchReset = (e) => {
            console.log('handleSearchReset')
            console.log(e)
            this.setState({
                searchFields: {}
            }, () => {
                this.getData({page: 1})
            })
        }

        // 下拉刷新
        bandleDownRefresh = (filter = []) => {
            this.handleSetState('dateSetting', {
                ...this.state.dateSetting,
                refreshing: true
            })
            console.log('bandleDownRefresh ---- ')
            this.getData({page: this.state.dateSetting.pagination.current}, {}, filter, () => {
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
