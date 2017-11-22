import React, {Component} from 'react'
import {Input, Button} from 'antd'

class Index extends Component {
    render() {
        return (
            <header className="header">
                <Button>index</Button>
                <Input placeholder="What needs to be done?" />
            </header>
        )
    }
}

export default Index
