import React from 'react'
import {
    Link,
} from 'react-router-dom'

function getRoutes(path) {
    let route = ''
    for (let i of path) {
        route += `/${i}`
    }
    return require(`.${route}`).default
}

class Model extends React.Component {
    componentWillMount() {
        console.log(this.props)
        // this.props.setCustomNavBarState(names[this.props.match.params.model], 'back')
    }
    render() {
        const {
            match,
            user,
        } = this.props
        return (
            <div>
                modelDetail
            </div>
        )
    }
}

export default Model
