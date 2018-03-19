import React from 'react'
// import {
//     Layout,
//     Button
// } from 'antd'
// import 'STYLE/css/theme.less'

// const { Header, Content, Footer, Sider } = Layout

class NotMatch extends React.Component {
    goBack = () => {
        this.props.history.push('/m/home')
    }
    render() {
        return (
            <div> 404</div>
        )
    }
}

export default NotMatch
