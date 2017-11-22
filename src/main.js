import ReactDOM from 'react-dom'
import React from 'react'
import Index from 'COMPONENT/index'
import Sider from 'COMPONENT/sider'

import '../style/css/main.less'

ReactDOM.render(
    <div>
        <Index />,
        <Sider />
    </div>,
    document.getElementById('app')
)
