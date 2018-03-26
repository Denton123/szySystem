import React from 'react'
import ReactDOM from 'react-dom'
import { List, Picker, WhiteSpace, Accordion } from 'antd-mobile'
import withBasicDataModel from '../../../../components/withBasicDataModel'
import CompanyDetailPageModel from '../../../../components/CompanyDetailPageModel'
import NoData from '../../../../components/NoData'

const taskStatus = [
    {
        label: '全部',
        value: 'all'
    },
    {
        label: '等待中',
        value: '0'
    },
    {
        label: '进行中',
        value: '1'
    },
    {
        label: '已完成',
        value: '2'
    },
    {
        label: '超时',
        value: '3'
    },
]

const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class ProjectDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            params: {
                obj: {},
                arr: []
            }
        }
    }

    componentWillMount() {
        let id = this.props.match.params.id
        // this.props.getData({project_id: id})
        this.setState(() => {
            return {
                params: {
                    ...this.state.params,
                    obj: {project_id: id}
                }
            }
        })
    }

    handleOk = (e) => {
        let p = {}
        let resetFilterArr = []
        if (e[0] === 'all') {
            resetFilterArr = ['status']
        } else {
            p['status'] = e[0]
        }
        this.setState(() => {
            return {
                params: {
                    obj: p,
                    arr: resetFilterArr
                }
            }
        })
    }

    render() {
        const {
            route,
            history,
            location,
            match,
            permissionRoutes,
            dateSetting
        } = this.props
        console.log('ProjectDetail.js---')
        console.log(dateSetting)

        let condition = [
            ({getFieldProps}) => {
                return (
                    <Picker extra="请选择(可选)"
                        data={taskStatus}
                        title="状态"
                        {...getFieldProps('status', {
                            initialValue: ['all']
                        })}
                        cols={1}
                        onOk={this.handleOk}
                        onDismiss={e => console.log('dismiss', e)}
                    >
                        <List.Item arrow="horizontal">状态</List.Item>
                    </Picker>
                )
            }
        ]

        return (
            <div>
                <CompanyDetailPageModel {...this.props} condition={condition} params={this.state.params}>
                    <NoData />
                </CompanyDetailPageModel>
            </div>
        )
    }
}

export default withBasicDataModel(ProjectDetail, {
    model: 'answer'
})
