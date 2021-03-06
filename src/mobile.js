import ReactDOM from 'react-dom'
import React from 'react'
import {BrowserRouter} from 'react-router-dom'

// 初始化axios配置
import './config/axiosConfig-mobile.js'

// 引入样式
import '../style/mobile-css/main.less'
import 'antd-mobile/dist/antd-mobile.less'

// antd国际化
import { LocaleProvider } from 'antd-mobile'

import 'antd-mobile/dist/antd-mobile.min.css'

// 根组件
import App from './mobile/App'

// 判断是否登录
new Promise(resolve => {
    axios.get('/user/auth')
        .then(res => {
            const app = () => (
                <LocaleProvider>
                    <App user={res.data} />
                </LocaleProvider>
            )
            resolve(app)
        })
        .catch(() => {
            const app = () => (
                <LocaleProvider>
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
