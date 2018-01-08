import React from 'react'
import Ts from 'COMPONENTS/page/Task'

const Task = Ts({
    total: false
})

class ProjectStageTasks extends React.Component {
    render() {
        return (
            <Task {...this.props} />
        )
    }
}

export default ProjectStageTasks
