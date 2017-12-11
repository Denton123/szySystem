import React, {Component} from 'react'
import {
    Input,
    Button,
    Card,
    Icon,
    Avatar
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

// 引入工具方法
import {isObject, isArray, valueToMoment} from 'UTILS/utils'
import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomRangePicker from 'COMPONENTS/date/CustomRangePicker'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'
import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

class ProjectInfo extends Component {
    render() {
        const {
            child,
            route,
            history,
            location,
            match
        } = this.props

        const condition = [
            {
                label: '项目名称',
                field: 'name',
                component: (<Input autoComplete="off" placeholder="项目名称" />)
            },
        ]

        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <CustomForm
                    layout="inline"
                    formStyle={{width: '100%'}}
                    customFormOperation={<Button type="primary" htmlType="submit">查询</Button>}
                    formFields={condition}
                    handleSubmit={this.props.handleQuery}
                    updateFormFields={this.props.updateQueryFields}
                    formFieldsValues={this.props.queryFieldValues}
                />
                <Card
                    style={{ width: 300 }}
                    cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                    actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                >
                    <Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title="Card title"
                        description="This is the description"
                    />
                </Card>
            </div>
        )
    }
}

const PI = withBasicDataModel(ProjectInfo, {
    model: 'project',
    title: '项目管理',
    tableSetting: {},
    modalSetting: {
        title: '项目管理'
    },
    queryFieldValues: {
        name: {
            value: null
        },
    },
    formFieldsValues: {
        id: {
            value: null
        },
        name: {
            value: null
        },
        realname: {
            value: null
        },
        gender: {
            value: null
        },
        email: {
            value: null
        },
        phone: {
            value: null
        },
        birth_date: {
            value: null
        },
        job: {
            value: null
        },
        entry_date: {
            value: null
        },
        quit_date: {
            value: null
        }
    },
})

export default PI