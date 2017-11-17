import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Input } from 'antd'

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date()
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    tick() {
        this.setState({
            date: new Date()
        })
    }
    render() {
        return (
            <div>
                <Input placeholder='please write down your ideas.' />
                <p>where are u kris wu</p>
                <p>It is {this.state.date.toLocaleTimeString()}</p>
            </div>
        )
    }
}

ReactDOM.render(
    <div>
        <Clock />
    </div>,
    document.getElementById('app')
)
