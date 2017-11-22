import ReactDOM from 'react-dom'
import React from 'react'

// import route from './routes/router.js'
// import BasicLayout from './layouts/BasicLayout.js'
import App from './App'

// import {Provider} from 'react-redux' //用到redux时使用
import 'STYLE/css/main.less'

// 路径别名有
// STYLE      根目录下的style文件
// COMPONENTS src目录下的components
// ROUTES     src目录下的routes
// UTILS      src目录下的utils
// VIEWS      src目录下的views
// CONFIG     src目录下的config
// SERVICES   src目录下的services
console.log($)
console.log(axios)

ReactDOM.render(
    <App />,
    document.getElementById('app')
)
