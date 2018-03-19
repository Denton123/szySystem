import React from 'react'
import {
    Button
} from 'antd'

class NotMatch extends React.Component {
    goBack = () => {
        this.props.history.push('/home/default')
    }
    render() {
        return (
            <div style={{ padding: 24, background: '#fff' }}>
                <Button className="pull-right" type="primary" onClick={this.goBack}>返回首页</Button>
                <h3 className="txt-c">您所查看的内容不存在或者已删除</h3>
            </div>
        )
    }
}

export default NotMatch
