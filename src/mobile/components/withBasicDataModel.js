import React from 'react'

import { isArray } from 'UTILS/utils'
import { ajax, index, show } from 'UTILS/ajax'

function withBasicDataModel(PageComponent, Datas) {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                model: Datas.model,
                dateSetting: {
                    dataSource: [],
                    pagination: {
                        current: 1,
                        pageSize: 0,
                        total: 0
                    }
                }
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

        // 获取数据
        getData = () => {
            if (this.props.user) {
                const id = this.props.user.id
                let p = { page: 1 }
                index(this.state.model, p).then(res => {
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
            }
        }

        render() {
            return (
                <PageComponent
                    getData={this.getData}
                    {...this.state}
                    {...this.props}
                    />
            )
        }
    }
}

module.exports = withBasicDataModel
