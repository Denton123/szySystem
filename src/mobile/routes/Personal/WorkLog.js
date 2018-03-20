import React from 'react'
import {
    List,
    Card,
    WingBlank,
    WhiteSpace,
    Pagination,
    Icon,
    Accordion,
    Drawer,
    NavBar
} from 'antd-mobile'

import './WorkLog.less'

// 引入工具方法
import {isFunction, isObject, valueToMoment, momentToValue, resetObject, valueToPriceRange, transformValue} from 'UTILS/utils'

import {ajax, index, store, show, update, destroy} from 'UTILS/ajax'

const Item = List.Item
const Brief = Item.Brief
const locale = {
    prevText: 'Prev',
    nextText: 'Next'
}

class ListExample extends React.Component {
    state = {
    }
    componentDidMount() {
    }
    render() {
        // 导航栏
        let navBar = (
            <NavBar
                mode="dark"
                leftContent="menu"
                rightContent={[
                    <Icon key="0" type="search" />
                ]}
            >WorkLog</NavBar>
        )

        let

        return (
            <div>
                {navBar}
            </div>
        )
    }
}

class Task extends React.Component {
    render() {
        return (
            <div>
                <ListExample />
            </div>
        )
    }
}

export default Task
