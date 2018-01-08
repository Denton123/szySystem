import React from 'react'
import Ts from 'COMPONENTS/page/Task'

const TotalTask = Ts({
    total: true
})

class Task extends React.Component {
    render() {
        return (
            <TotalTask {...this.props} />
        )
    }
}

export default Task
