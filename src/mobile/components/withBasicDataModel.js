import React from 'react'
import {
    Toast,
    ActivityIndicator
} from 'antd-mobile'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

function withBasicDataModel(PageComponent, Datas) {
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
                    }
                },
                animating: false
            }
        }

        componentDidMount() {
            // this.getData()
            console.log('withBasicDataModel.js')
            console.log(this.props.location)
            if (this.props.location.state && this.props.location.state.page) {
                let current = this.props.location.state.page
                setTimeout(this.setState(prevState => {
                    let pagination = prevState.dateSetting.pagination
                    pagination['current'] = current
                    return {
                        dateSetting: {
                            ...prevState.dateSetting,
                            pagination: pagination
                        }
                    }
                }), 0)
            }
        }

        // 获取数据(请求的参数)
        getData = (params) => {
            let p = {} // 用来装locationState 和传过来的参数params
            let locationState = {}
            if (this.props.location.state) {
                locationState = this.props.location.state
                p = locationState
            }
            // 判断有参数
            if (params) {
                p = {...p, ...params}
            }
            this.props.history.replace(`${this.props.location.pathname}`, p)
            Toast.loading('正在加载...', 0)
            if (this.props.user) {
                const id = this.props.user.id
                params = { page: 1, ...p }
                // 参数需要过滤掉的字段
                let filterArr = ['tabIndex']
                let filterParams = {}
                Object.keys(params).forEach(key => {
                    if (filterArr.indexOf(key) < 0) {
                        filterParams[key] = params[key]
                    }
                })
                index(this.state.model, filterParams)
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
                })
                .catch(e => {
                    Toast.hide()
                    Toast.fail('请求失败', 1)
                })
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
        handleSearchSubmit = (searchFields) => {
            console.log(searchFields)
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
            this.getData(params)
        }

        // 搜索栏重置
        handleSearchReset = () => {
            console.log(55)
            this.getData()
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
                        {...this.state}
                        {...this.props}
                    />
                </div>
            )
        }
    }
}

module.exports = withBasicDataModel
