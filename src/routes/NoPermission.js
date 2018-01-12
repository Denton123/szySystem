import React from 'react'
import {
    Button
} from 'antd'

class NoPermission extends React.Component {
    render() {
        return (
            <div style={{ padding: 24, background: '#fff' }}>
                <h3 className="txt-c">没有权限哦，请联系管理员添加浏览权限</h3>
            </div>
        )
    }
}

export default NoPermission
