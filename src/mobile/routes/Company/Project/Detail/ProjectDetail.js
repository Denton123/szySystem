import React from 'react'
import T from '../../../../components/page/task'

let TheTask = T({
    _type: 'project',
    hasProjectSelect: false
})

class Task extends React.Component {
    render() {
        return (
            <TheTask {...this.props} />
        )
    }
}

export default Task
