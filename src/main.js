import ReactDOM from 'react-dom'
import React from 'react'

// import route from './routes/router.js'
import BasicLayout from './layouts/BasicLayout.js'
// import {Provider} from 'react-redux' //用到redux时使用
import 'STYLE/css/main.less'

console.log($)
console.log(axios)

ReactDOM.render(
    <BasicLayout />,
    document.getElementById('app')
)
