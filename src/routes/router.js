import React, {Component} from 'react'
import { Router, Route, Switch } from 'dva/router'
import { getNavData } from 'COMMON/nav'
import { Spin } from 'antd'
import dynamic from 'dva/dynamic'
import cloneDeep from 'lodash/cloneDeep'
import { getPlainNode } from 'UTILS/utils'

dynamic.setDefaultLoadingComponent(() => {
    return <Spin size="large" />
})

function getRouteData(navData, path) {
    if (!navData.some(item => item.layout === path) ||
      !(navData.filter(item => item.layout === path)[0].children)) {
        return null
    }
    const route = cloneDeep(navData.filter(item => item.layout === path)[0])
    const nodeList = getPlainNode(route.children)
    return nodeList
}

function getLayout(navData, path) {
    if (!navData.some(item => item.layout === path) ||
      !(navData.filter(item => item.layout === path)[0].children)) {
        return null
    }
    const route = navData.filter(item => item.layout === path)[0]
    return {
        component: route.component,
        layout: route.layout,
        name: route.name,
        path: route.path
    }
}

function RouterConfig({history, app}) {
    const navData = getNavData(app)
    const BasicLayout = getLayout(navData, 'BasicLayout').component

    const passProps = {
        app,
        navData,
        getRouteData: (path) => {
            return getRouteData(navData, path)
        }
    }

    const login = (location, cb) => {
        require.ensure([], require => {
            cb(null, require('VIEWS/Login').default)
        }, 'login')
    }

    const register = (location, cb) => {
        require.ensure([], require => {
            cb(null, require('VIEWS/Register').default)
        }, 'register')
    }

    return (
        <Router history={history}>
            <Switch>
                <Route path="/login" getComponent={login} />
                <Route path="/register" getComponent={register} />
                <Route routes={getNavData} />
            </Switch>
        </Router>
    )
}

export default RouterConfig
