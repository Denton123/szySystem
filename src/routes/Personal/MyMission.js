import React from 'react'
import {
    Tabs,
    Card
} from 'antd'

import {ajax} from 'UTILS/ajax'

import PersonalTask from 'COMPONENTS/page/PersonalTask'

const TabPane = Tabs.TabPane

const HasProjectPersonalTask = PersonalTask({
    hasProject: true
})

const NoProjectPersonalTask = PersonalTask({
    hasProject: false
})

class MyMission extends React.Component {
    state = {
        __key: this.props.location.state && this.props.location.state.__key ? this.props.location.state.__key : 'normal',
        myTask: {
            wait: 0,
            doing: 0,
            done: 0
        }
    }
    getMyTaskStatus = () => {
        ajax('get', `/task/${this.props.user.id}/personal-status`)
            .then(res => {
                this.setState({
                    myTask: {
                        ...res.data
                    }
                })
            })
    }
    onTabChange = (key) => {
        this.props.history.replace(this.props.location.pathname, {
            page: 1,
            __key: key
        })

        this.setState({
            __key: key
        })
    }
    render() {
        const state = this.state
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Card bordered={false}>
                    <Card.Grid>
                        待办任务
                        <span className="pull-right">{state.myTask.wait}</span>
                    </Card.Grid>
                    <Card.Grid>
                        正在进行任务
                        <span className="pull-right">{state.myTask.doing}</span>
                    </Card.Grid>
                    <Card.Grid>
                        已完成任务
                        <span className="pull-right">{state.myTask.done}</span>
                    </Card.Grid>
                </Card>
                <Tabs defaultActiveKey={state.__key} onTabClick={this.onTabChange} animated={false}>
                    <TabPane tab="普通任务" key="normal">
                        <NoProjectPersonalTask {...this.props} getMyTaskStatus={this.getMyTaskStatus} />
                    </TabPane>
                    <TabPane tab="项目任务" key="project">
                        <HasProjectPersonalTask {...this.props} getMyTaskStatus={this.getMyTaskStatus} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default MyMission
