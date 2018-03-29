import React from 'react'
import {
    Tabs, WhiteSpace, Badge
} from 'antd-mobile'
import T from '../../components/page/task'

const NoProjectTask = T({
    _type: 'normal',
    // 是否需要项目下拉选择
    hasProjectSelect: false,
    resetNotFilter: ['project_id']
})

const HasProjectTask = T({
    _type: 'project',
    hasProjectSelect: true,
    resetNotFilter: ['project_id']
})

const tabs = [
    { title: '普通任务' },
    { title: '项目任务' }
]

class Task extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // tab的下标
            tabIndex: 0
        }
    }
    componentWillMount() {
        let tabIndex = this.props.location.state && this.props.location.state.tabIndex ? this.props.location.state.tabIndex : 0
        this.setState({
            tabIndex: tabIndex
        })
    }
    handleTabClick = (tab, index) => {
        let tabIndex = index === 0 ? 'null' : 'notnull'
        this.setState({
            tabIndex: index
        })
        this.props.history.replace(this.props.location.pathname, {project_id: tabIndex, tabIndex: index, page: 1})
    }
    render() {
        return (
            <div>
                <Tabs tabs={tabs}
                    page={this.state.tabIndex}
                    prerenderingSiblingsNumber={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab) }}
                    onTabClick={this.handleTabClick}
                    animated={false}
                >
                    <div style={{ backgroundColor: '#fff' }}>
                        <NoProjectTask {...this.props} />
                    </div>
                    <div style={{ backgroundColor: '#fff' }}>
                        <HasProjectTask {...this.props} />
                    </div>
                </Tabs>
            </div>
        )
    }
}

export default Task
