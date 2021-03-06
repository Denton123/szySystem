import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter} from 'react-router-dom'

// 初始化axios配置
import './config/axiosConfig.js'

// antd国际化
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'

// 根组件
import App from './App'
import 'animate.css/animate.min.css'
// import {Provider} from 'react-redux' //用到redux时使用
import 'STYLE/css/main.less'

// 路径别名有
// STYLE      根目录下的style文件
// COMPONENTS src目录下的components
// ROUTES     src目录下的routes
// UTILS      src目录下的utils
// VIEWS      src目录下的views
// CONFIG     src目录下的config

// 判断是否登录
new Promise(resolve => {
    axios.get('/user/auth')
        .then(res => {
            const app = () => (
                <LocaleProvider locale={zhCN}>
                    <App user={res.data} />
                </LocaleProvider>
            )
            resolve(app)
        })
        .catch(() => {
            const app = () => (
                <LocaleProvider locale={zhCN}>
                    <App />
                </LocaleProvider>
            )
            resolve(app)
        })
})
.then(Root => {
    ReactDOM.render(
        <Root />,
        document.getElementById('app')
    )
})
