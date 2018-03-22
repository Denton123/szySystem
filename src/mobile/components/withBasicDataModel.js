import React from 'react'
import {
    Toast,
    ActivityIndicator
} from 'antd-mobile'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

function withBasicDataModel(PageComponent, Datas) {
    let condition = Datas.condition ? Datas.condition : []
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

        componentWillMount() {
            // this.getData()
            console.log('withBasicDataModel.js')
            console.log(this.props.location)
            if (this.props.location.state && this.props.location.state.page) {
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

        // 获取数据(请求的参数)
        getData = (params) => {
            // Toast.loading('正在加载...', 0)
            if (this.props.user) {
                const id = this.props.user.id
                params = { page: 1, ...params }
                index(this.state.model, params)
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
            // if (this.props.location.state) {
            //     params = {
            //         ...params,
            //         ...this.props.location.state
            //     }
            // }
            this.handleSetState('dateSetting', {
                ...this.state.dateSetting,
                pagination: {
                    ...this.state.dateSetting.pagination,
                    current: e
                }
            })
            // this.props.history.replace(`${this.props.location.pathname}`, params)
            this.getData({page: params.page})
        }

        render() {
            return (
                <div>
                    <PageComponent
                        getData={this.getData}
                        handleSetState={this.handleSetState}
                        handlePageChange={this.handlePageChange}
                        {...this.state}
                        {...this.props}
                    />
                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={this.state.animating}
                    />
                </div>
            )
        }
    }
}

module.exports = withBasicDataModel
