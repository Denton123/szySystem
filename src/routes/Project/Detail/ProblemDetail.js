import React, {Component} from 'react'
import {
    Input,
    Button,
    Card,
    Avatar,
    Divider,
    message,
    List,
    Spin,
    Checkbox,
    Popconfirm,
    Icon
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'
import ReactQuill from 'react-quill'

// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, show, answerStore, store, index, update} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import './ProblemDetail.less'
const {Meta} = Card

function escape(str) {
    return str.replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}
function stripscript(s) {
    return s.replace(/<script.*?>.*?<\/script>/ig, '')
}
class ProblemDetail extends Component {
    state = {
        DetailData: [],
        answer: '',
        answerList: [],
        loading: true,
        loadingMore: false,
        showLoadingMore: true,
        chooseAccept: true,
        flag: ''
    }
    componentDidMount() {
        this.getData()
    }
    goBack = (e) => {
        this.props.history.goBack()
    }
    getData = (callback) => {
        let id = this.props.match.params.id
        show(`problem/${id}`).then(res => {
            this.setState({
                loading: false,
                DetailData: resetObject(res.data)
            })
            console.log(this.state.DetailData)
        }).then(() => {
            let showId = this.state.DetailData.id
            show(`/answer/${showId}`).then(res => {
                res.data.forEach((t) => {
                    t.date = t.date.substr(0, 10)
                })
                this.setState({
                    answerList: res.data
                })
                console.log(this.state.answerList)
            })
        })
    }
    answerChange = (value) => {
        this.setState({
            answer: value
        })
    }
    onLoadMore = () => {
        this.setState({
            loadingMore: true
        })
    }
    answerSubmit = () => {
        const Data = this.state.DetailData
        const answerObj = {
            answer: this.state.answer,
            user_id: this.props.user.id,
            problem_id: Data.id,
            date: new Date()
        }
        store('/answer', answerObj).then(res => {
            res.status === 200 ? message.success('保存成功') : message.success('保存失败')
            this.setState({
                answer: ''
            })
        }).then(() => {
            this.getData()
        })
    }
    acceptAnswer = (e) => {
        console.log(e.target.checked)
        // this.setState({
        //     flag: e.target.dataset.id
        // })
        // console.log(this.state.flag)
    }
    onConfirm = (e) => {
        const id = this.state.DetailData.id
        update(`/answer/${id}`, 1).then(res => {
            console.log(res)
            console.log(this.state.DetailData)
        })
        this.setState({
            chooseAccept: false
        })
        console.log(this.state.flag + '会是个好')
    }
    onCancel = (e) => {
        console.log(e)
    }
    render() {
        const {DetailData, answer, answerList, showLoadingMore, loading, loadingMore, chooseAccept} = this.state
        const {
            child,
            route,
            history,
            location,
            match,
            user
        } = this.props

        const formFields = [
            {
                label: '标题',
                field: 'title',
                component: (<Input autoComplete="off" placeholder="请输入标题" />)
            },
            {
                label: '内容',
                field: 'problem',
                formItemStyle: {
                    height: 350
                },
                component: (<ReactQuill placeholder="内容" style={{height: 250}} />)
            }
        ]
        const loadMore = showLoadingMore ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
            </div>
            ) : null

        const Bottom = ({time, text, avatar}) => (
            <span>
                <span style={{marginRight: 10}}>{time}回答</span>
                {text}
                <Avatar src={avatar} icon="user" className="answerAvatar" />
            </span>
            )
        const Accept = ({id}) => (
            <Popconfirm title="确定采纳此答案吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={this.onConfirm}
                onCancel={this.onCancel}>
                {/*<label htmlFor="set">采纳</label>*/}
                <Checkbox onChange={this.acceptAnswer}>采纳</Checkbox>
                {/*<input type="checkbox" onClick={this.acceptAnswer} id="set" data-id={id} className="ant-checkbox" />*/}
            </Popconfirm>
        )
        return (
            <div style={{padding: 24, background: '#fff', height: '100%'}}>
                <div style={{width: '80%', margin: '0 auto'}}>
                    <Card
                        title={DetailData.title}
                        extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                    >
                        <p className="Problem">{DetailData.problem}</p>
                        {user && user.id === DetailData.user_id
                            ? <Button type="primary" data-id={DetailData.id} onClick={this.props.handleEdit}>编辑</Button>
                            : null}
                        <div className="msg">
                            <span>{`提问者：${DetailData.realname}`}</span>
                            <span>{`提问时间：${DetailData.createdAt}`}</span>
                        </div>
                        <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel}>
                            <CustomForm
                                formStyle={{width: '100%'}}
                                formFields={formFields}
                                handleSubmit={this.props.handleFormSubmit}
                                updateFormFields={this.props.updateFormFields}
                                formFieldsValues={this.props.formFieldsValues}
                                isSubmitting={this.props.isSubmitting}
                            />
                        </CustomModal>
                    </Card>
                    <Divider />
                    <List
                        itemLayout="vertical"
                        className="demo-loadmore-list"
                        loading={loading}
                        loadMore={loadMore}
                        dataSource={answerList}
                        renderItem={item => (
                            <List.Item
                                key={item.id}
                                className="List"
                                extra={<Accept id={item.id} />}
                                actions={[<Bottom
                                    time={item.date}
                                    text={item.User.realname}
                                    avatar={`/uploadImgs/${item.User.avatar}`}
                                        />]}>
                                <List.Item.Meta
                                    description={item.answer} />
                            </List.Item>
                            )} />
                    <Divider />
                    <h4>撰写答案</h4>
                    <ReactQuill placeholder="撰写答案" style={{height: 110}} value={answer} onChange={this.answerChange} />
                    <Button type="primary" style={{float: 'right', marginTop: 50}} onClick={this.answerSubmit}>提交</Button>
                </div>
            </div>
        )
    }
}

const PE = withBasicDataModel(ProblemDetail, {
    model: 'problem',
    formFieldsValues: {
        id: {
            value: null
        },
        title: {
            value: null
        },
        problem: {
            value: null
        }
    }
})

export default PE
