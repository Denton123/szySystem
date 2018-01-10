import React from 'react'
import {
    Layout,
    Button
} from 'antd'
import 'STYLE/css/theme.less'

const { Header, Content, Footer, Sider } = Layout

class NotMatch extends React.Component {
    goBack = () => {
        this.props.history.push('/home')
    }
    render() {
        return (
            <Layout>
                <Header>Header</Header>
                <Content>
                    <p>页面不存在</p>
                    <Button type="primaty" onClick={this.goBack}>返回首页</Button>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        )
    }
}

export default NotMatch
