import React from 'react'
import {
    Link,
} from 'react-router-dom'
import { List, WingBlank, Button, WhiteSpace, Card, ListView, Modal, Toast } from 'antd-mobile'

import {index, destroy} from '../../../utils/ajax'

import CustomForm from '../../components/CustomForm'

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
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })
        this.state = {
            // 长列表
            dataSource,
            isLoading: true,
            totalPage: 1,
            pageSize: 10,
            currentPage: 1,
            // 对话框
            visible: false,
        }
    }
    componentWillMount() {
        this.getData()
    }
    // 获取数据列表
    getData = (page = 1) => {
        index('summary', {page: page, user_id: this.props.user.id})
            .then(res => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(res.data.data),
                    isLoading: false,
                    totalPage: res.data.totalPage,
                    pageSize: res.data.pageSize,
                    currentPage: res.data.currentPage,
                })
            })
    }
    // 长列表到达最低层
    onEndReached = (event) => {
        console.log('reach end', event)
        if (this.state.isLoading && this.state.currentPage === this.state.totalPage) {
            return
        }
        getData(this.state.currentPage++)
    }
    // 打开对话框
    onModalOpen = type => (e) => {
        e.preventDefault() // 修复 Android 上点击穿透
        this.setState({
            visible: true,
        })
    }
    // 关闭对话框回调
    onModalClose = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const {
            // 长列表
            dataSource,
            pageSize,
            // 对话框
            visible,
        } = this.state
        // 长列表分离器
        const separator = (sectionID, rowID) => (
            <div
                key={`${sectionID}-${rowID}`}
                style={{
                    backgroundColor: '#F5F5F9',
                    height: 8,
                    borderTop: '1px solid #ECECED',
                    borderBottom: '1px solid #ECECED',
                }}
            />
        )
        // 长列表行
        const row = (rowData, sectionID, rowID) => {
            let content = escape(rowData.content)
            return (
                <Card key={rowID}>
                    <Card.Header
                        title={rowData.title}
                        extra={<span>{rowData.User.realname}</span>}
                    />
                    <Card.Body>
                        <div dangerouslySetInnerHTML={{__html: content}} />
                    </Card.Body>
                    <Card.Footer extra={<div>{rowData.date}</div>} />
                </Card>
            )
        }
        return (
            <div>
                <WingBlank>
                    <WhiteSpace size="lg" />
                    <Button type="primary" onClick={this.onModalOpen('add')}>发表总结</Button>
                    <WhiteSpace />
                    <Modal
                        popup
                        visible={visible}
                        onClose={this.onModalClose}
                        animationType="slide-up"
                    >
                        <List>
                            {['股票名称', '股票代码', '买入价格'].map((i, index) => (
                                <List.Item key={index}>{i}</List.Item>
                            ))}
                            <List.Item>
                                <Button type="primary">保存</Button>
                            </List.Item>
                        </List>
                    </Modal>
                </WingBlank>
                <ListView
                    dataSource={dataSource}
                    renderFooter={() => {
                        console.log(dataSource.getRowCount())
                        if (dataSource.getRowCount() === 0) {
                            return (<div style={{ padding: 30, textAlign: 'center' }}>
                                暂无数据
                            </div>)
                        } else {
                            return (<div style={{ padding: 30, textAlign: 'center' }}>
                                {this.state.isLoading ? '加载中...' : '加载完毕'}
                            </div>)
                        }
                    }}
                    renderRow={row}
                    renderSeparator={separator}
                    pageSize={pageSize}
                    useBodyScroll
                    onScroll={() => { console.log('scroll') }}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />
            </div>
        )
    }
}

export default Summary
