import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, DatePicker, WhiteSpace, WingBlank, Pagination, Button, Card, Popover, Icon, Modal, Toast } from 'antd-mobile'

import {mIndex, mDestroy} from '../../../utils/ajax'

const alert = Modal.alert

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
            // 总结数据
            dataSource: [],
            pagination: {},
            // popover
            visible: false,
        }
    }
    componentWillMount() {
        this.getData()
    }
    // 获取数据列表
    getData = (params = {page: 1}) => {
        params['user_id'] = this.props.user.id
        mIndex('summary', params)
            .then(res => {
                this.setState({
                    dataSource: res.data.data,
                    pagination: {
                        total: res.data.totalPage,
                        current: res.data.currentPage,
                        onChange: page => this.getData({page: page})
                    }
                })
            })
    }

    onDateChange = (date, type) => {
        if (type === 'startDate') {
            this.setState({
                endDate: null
            })
        }
        this.setState({
            [type]: date
        })
    }

    onPopoverSelect = (node) => {
        if (node.key === 'edit') {
            this.props.history.push(`/home/work/summary/detail?_type=edit&id=${node.props.value}`)
        } else if (node.key === 'delete') {
            this.setState({
                visible: false,
            })
            this.destroy(node.props.value)
        }
    }

    // 删除单个总结
    destroy = (id) => {
        alert('删除', '是否删除当前总结？', [
            {text: '取消', style: 'default'},
            {
                text: '确定',
                onPress: () => {
                    Toast.loading('删除中', 0)
                    mDestroy(`/${this.props.match.params.model}/${id}`).then(res => {
                        if (parseInt(res.data.id) === parseInt(id)) {
                            Toast.info('删除成功', 1)
                            this.getData()
                        } else {
                            Toast.info('删除失败', 1)
                        }
                    })
                }
            },
        ])
    }

    search = () => {
        const {
            startDate,
            endDate
        } = this.state
        if (startDate && endDate) {
            this.getData({
                page: 1,
                date: [startDate, endDate]
            })
        } else {
            Toast.info('请选择日期', 1)
        }
    }

    render() {
        const {
            history,
            match
        } = this.props
        const {
            startDate,
            endDate,
            dataSource,
            pagination,
            visible,
        } = this.state
        return (
            <div>
                <List>
                    <DatePicker
                        mode="date"
                        value={startDate}
                        maxDate={new Date(Date.now())}
                        onChange={(date) => this.onDateChange(date, 'startDate')}
                    >
                        <List.Item arrow="horizontal">开始日期</List.Item>
                    </DatePicker>
                    <DatePicker
                        mode="date"
                        value={endDate}
                        minDate={startDate}
                        maxDate={new Date(Date.now())}
                        onChange={(date) => this.onDateChange(date, 'endDate')}
                    >
                        <List.Item arrow="horizontal">结束日期</List.Item>
                    </DatePicker>
                    <List.Item>
                        <Button type="primary" size="small" onClick={this.search} >查找</Button>
                    </List.Item>
                </List>
                <WhiteSpace size="lg" />
                <WingBlank>
                    <Button type="primary" size="small" onClick={() => history.push(`/home/work/summary/detail?_type=add`)} >发表</Button>
                </WingBlank>
                <WhiteSpace size="lg" />
                {dataSource.length > 0 ? (
                    <div>
                        {dataSource.map(ds => (
                            <div key={ds.id}>
                                <Card full>
                                    <Card.Header
                                        title={ds.title}
                                        extra={<span>{ds.User.realname}</span>}
                                    />
                                    <Card.Body>
                                        <div dangerouslySetInnerHTML={{__html: ds.content}} />
                                    </Card.Body>
                                    <Card.Footer extra={
                                        <Popover
                                            mask
                                            visible={visible}
                                            overlay={[
                                                (<Popover.Item key="edit" value={ds.id}>编辑</Popover.Item>),
                                                (<Popover.Item key="delete" value={ds.id}>删除</Popover.Item>),
                                            ]}
                                            onSelect={this.onPopoverSelect}
                                        >
                                            <Icon type="ellipsis" />
                                        </Popover>
                                    } />
                                </Card>
                                <WhiteSpace size="lg" />
                            </div>
                        ))}
                        <WhiteSpace size="lg" />
                        <Pagination {...pagination} />
                    </div>
                ) : (
                    <Card>
                        <Card.Body>
                            暂无总结
                        </Card.Body>
                    </Card>
                )}
            </div>
        )
    }
}

export default Summary
