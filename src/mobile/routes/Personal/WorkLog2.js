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
        disabled: false,
        open: false
    }
    componentDidMount() {

    }
    onChange = (key) => {
        console.log(key)
    }
    onOpenChange = (...args) => {
        console.log(args)
        this.setState({ open: !this.state.open })
    }
    render() {
        const sidebar = (<List>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i, index) => {
                if (index === 0) {
                    return (<List.Item key={index}
                        thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                        multipleLine
                    >Category</List.Item>)
                }
                return (<List.Item key={index}
                    thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>)
            })}
        </List>)
        return (
            <div>
                <List renderHeader={() => 'Basic Style'} className="my-list">
                    <Item extra={'extra content'}>Title</Item>
                    <Item extra={'extra content'} arrow="horizontal">Title</Item>
                    <Item arrow="horizontal" multipleLine onClick={() => {}}>
                        <Brief>
                            <Card>
                                <Card.Header
                                    title="This is title"
                                    thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
                                    extra={<span>this is extra</span>}
                                />
                                <Card.Body>
                                    <div>This is content of `Card`</div>
                                </Card.Body>
                                <Card.Footer content="footer content" extra={<div>extra footer content</div>} />
                            </Card>
                        </Brief>
                    </Item>
                    <Item
                        arrow="horizontal"
                        multipleLine
                        onClick={() => {}}
                        platform="android"
                    >
                        aaa<Brief>bbb</Brief>
                    </Item>
                </List>
                <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                    <Accordion.Panel header="Title 3" className="pad">
                        <Item
                            arrow="horizontal"
                            multipleLine
                            onClick={() => {}}
                            platform="android"
                        >
                            aaa<Brief>bbb</Brief>
                        </Item>
                    </Accordion.Panel>
                </Accordion>
                <Pagination total={5} current={1} locale={locale} />
                <button onClick={this.onOpenChange}>button</button>
                <Drawer
                    className="my-drawer"
                    style={{ minHeight: document.documentElement.clientHeight }}
                    enableDragHandle
                    contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
                    sidebar={sidebar}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                    position={'bottom'}
                >
                    Click upper-left corner
                </Drawer>
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
