import React from 'react'
import {
    Button
} from 'antd'

class BasicNotMatch extends React.Component {
    goBack = () => {
        this.props.history.push('/home/default')
    }
    render() {
        return (
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                <Button className="pull-right" type="primary" onClick={this.goBack}>返回首页</Button>
                <h3 className="txt-c">内容不见了</h3>
            </div>
        )
    }
}

export default BasicNotMatch
