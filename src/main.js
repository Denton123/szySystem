import ReactDOM from 'react-dom'
import React from 'react'
import {Router, Route, browserHistory, BrowserRouter, hashHistory} from 'react-router-dom'
// import route from './routes/router.js'
import BasicLayout from './layouts/BasicLayout.js'
// import {Provider} from 'react-redux' //用到redux时使用
import '../style/css/main.less'

ReactDOM.render(
    <BasicLayout />,
    document.getElementById('app')
)
