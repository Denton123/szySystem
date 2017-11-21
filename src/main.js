import ReactDOM from 'react-dom'
import React from 'react'
// import route from './routes/router.js'
import Index from './components/index.jsx'
import Sider from './components/sider.jsx'
// import {Provider} from 'react-redux' //用到redux时使用

import '../style/css/main.css'

ReactDOM.render(
    <div>
        <Index />,
        <Sider />
    </div>,
    document.getElementById('app')
)
