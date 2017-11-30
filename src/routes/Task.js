import React from 'react'
import { Layout, Breadcrumb, Icon, Card, Col, Row, List } from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

const { Content, Header } = Layout

class Default extends React.Component {
    testGetData = () => {
        axios.get('/api/user')
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }

    render() {
        console.log(this.props)
        const route = this.props.route
        const history = this.props.history
        const location = this.props.location
        const match = this.props.match

        return (
            <Content className="Content">
                <Header className="IndexHeader">
                    <Breadcrumb className="Breadcrumb">
                        <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
                <div className="Main">
                    task
                </div>
            </Content>
        )
    }
}

export default Default
