import React from 'react'
import {
    Tabs
} from 'antd'

import Ts from 'COMPONENTS/page/Task'

const TabPane = Tabs.TabPane

const NoProjectTask = Ts({
    total: true,
    hasProject: false
})

const HasProjectTask = Ts({
    total: true,
    hasProject: true
})

class Task extends React.Component {
    state = {
        __key: this.props.location.state && this.props.location.state.__key ? this.props.location.state.__key : 'normal'
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
                <Tabs defaultActiveKey={state.__key} onTabClick={this.onTabChange} animated={false}>
                    <TabPane tab="普通任务" key="normal">
                        <NoProjectTask {...this.props} />
                    </TabPane>
                    <TabPane tab="项目任务" key="project">
                        <HasProjectTask {...this.props} />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Task
