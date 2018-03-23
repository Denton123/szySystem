import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, DatePicker, WhiteSpace, WingBlank, Pagination, Button, Card } from 'antd-mobile'

import {mIndex, mDestroy} from '../../../utils/ajax'

/**
 * [escape 过滤script标签]
 * @DateTime 2017-12-11
 * @param    {string}   str [html标签字符串]
 * @return   {string}       [过滤后的html标签字符串]
 */
function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

class Summary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: null,
            endDate: null,
            dataSource: [],
        }
    }
    componentWillMount() {
        this.getData()
    }
    // 获取数据列表
    getData = (page = 1) => {
        mIndex('summary', {page: page, user_id: this.props.user.id})
            .then(res => {
                console.log(res)
                this.setState({
                    dataSource: res.data.data,
                })
            })
    }

    onDateChange = () => {
    }

    render() {
        const {
            startDate,
            endDate,
            dataSource,
        } = this.state
        return (
            <div>
                <List>
                    <DatePicker
                        mode="date"
                        value={startDate}
                        maxDate={new Date(Date.now())}
                        onChange={this.onDateChange}
                    >
                        <List.Item arrow="horizontal">开始日期</List.Item>
                    </DatePicker>
                    <DatePicker
                        mode="date"
                        value={endDate}
                        maxDate={new Date(Date.now())}
                        onChange={this.onDateChange}
                    >
                        <List.Item arrow="horizontal">结束日期</List.Item>
                    </DatePicker>
                    <List.Item>
                        <Button type="primary" >查找</Button>
                    </List.Item>
                </List>
                <WhiteSpace size="lg" />
                <WingBlank>
                    <Button type="primary" >发表</Button>
                </WingBlank>
                <WhiteSpace size="lg" />
                {dataSource.length > 0 ? (
                    <Card key={rowID}>
                        <Card.Header
                            title={rowData.title}
                            extra={<span>{rowData.User.realname}</span>}
                        />
                        <Card.Body>
                            <div dangerouslySetInnerHTML={{__html: content}} />
                        </Card.Body>
                        <Card.Footer extra={<Pagination total={5} current={1} />} />
                    </Card>
                ) : (
                    <Card>
                        <Card.Body>
                            暂时还没有周总结
                        </Card.Body>
                    </Card>
                )}
            </div>
        )
    }
}

export default Summary
