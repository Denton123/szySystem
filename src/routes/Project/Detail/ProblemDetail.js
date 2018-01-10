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
import moment from 'moment'
// 引入工具方法
import {isObject, isArray, valueToMoment, resetObject, formatDate} from 'UTILS/utils'
import {ajax, show, store, index, update} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import './ProblemDetail.less'
const {Meta} = Card

class ProblemDetail extends Component {
    state = {
        DetailData: {},
        answer: '',
        answerList: [],
        loading: true,
        loadingMore: false,
        showLoadingMore: false,
        showCheckbox: false,
        flag: 1,
        allData: []
    }
    componentDidMount() {
        let id = this.props.match.params.id
        show(`problem/${id}`).then(res => {
            if (Object.keys(res.data).length === 0) {
                this.props.history.push('/home/404')
            } else {
                this.setState({
                    loading: false,
                    DetailData: resetObject(res.data)
                })
            }
        }).then(() => {
            if (Object.keys(this.state.DetailData).length > 0) {
                this.getData()
            }
        })
    }
    goBack = () => {
        this.props.history.push('/home/project/problem')
    }
    getData = (callback) => {
        let showallId = this.state.DetailData.id
        var usedAll = []
        ajax('get', `/answer/${showallId}/showIdData`).then(res => {
            this.setState({
                allData: res.data
            })
            const allData = this.state.allData
            for (let u in allData) {
                usedAll.push(allData[u].used)
            }
        })
        this.getAnswerData(1, res => {
            this.setState({
                answerList: res.data.data,
                flag: res.data.currentPage
            })
            if (res.data.total > res.data.pageSize) {
                this.setState({
                    showLoadingMore: true
                })
            }
            const detailArr = this.state.DetailData
            const userid = this.props.user.id
            if (usedAll.indexOf('1') === -1 && userid === detailArr.user_id) {
                this.setState({
                    showCheckbox: true
                })
            } else {
                this.setState({
                    showCheckbox: false
                })
            }
        })
    }
    getAnswerData = (page, callback) => {
        let showId = this.state.DetailData.id
        show(`/answer/${showId}?page=${page}`).then(res => {
            res.data.data.forEach((t) => {
                t.date = moment(t.date).startOf('hour').fromNow()
            })
            if (res.data.currentPage === res.data.totalPage) {
                this.setState({
                    showLoadingMore: false
                })
            }
            callback(res)
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
        const totalPage = this.state.flag + 1
        this.getAnswerData(totalPage, res => {
            const answerList = this.state.answerList.concat(res.data.data)
            this.setState({
                answerList,
                loadingMore: false,
                flag: res.data.currentPage
            })
            const answerArr = this.state.answerList
            const detailArr = this.state.DetailData
            const userid = this.props.user.id
            var arr = []
            for (let i in answerArr) {
                arr.push(answerArr[i].used)
            }
            if (arr.indexOf('1') === -1 && userid === detailArr.user_id) {
                this.setState({
                    showCheckbox: true
                })
            } else {
                this.setState({
                    showCheckbox: false
                })
            }
        })
    }
    answerSubmit = () => {
        if (this.state.answer !== '') {
            const Data = this.state.DetailData
            const answerObj = {
                answer: this.state.answer,
                user_id: this.props.user.id,
                problem_id: Data.id,
                date: new Date(),
                used: '0'
            }
            store('/answer', answerObj).then(res => {
                res.status === 200 ? message.success('保存成功') : message.success('保存失败')
                this.setState({
                    answer: ''
                })
            }).then(() => {
                this.getData()
            })
        } else {
            message.info('请输入答案再提交')
        }
    }
    acceptAnswer = (e) => {
        const id = e.target.dataset.id
        localStorage.setItem('changeId', id)
    }
    onConfirm = (e) => {
        const id = this.state.DetailData.id
        update(`/answer/${id}`, '1').then(res => {
            const changeId = localStorage.getItem('changeId')
        })
        const changeId = localStorage.getItem('changeId')
        ajax('post', `/answer/${changeId}/answerupdate`).then(res => {
            this.getData()
        })
    }
    onCancel = (e) => {
    }
    handleFormSubmit = (values) => {
        this.props.handleFormSubmit(values)
        this.getData()
    }
    render() {
        const {DetailData, answer, answerList, showLoadingMore, loading, loadingMore, showCheckbox} = this.state
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
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('title', {})(<Input autoComplete="off" placeholder="请输入标题" />)
                },
            },
            {
                label: '内容',
                formItemStyle: {
                    height: 350
                },
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('problem', {})(<ReactQuill placeholder="内容" style={{height: 250}} />)
                },
            }
        ]
        const loadMore = showLoadingMore ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.onLoadMore}>查看更多回答</Button>}
            </div>
            ) : null

        const Bottom = ({time, text, avatar}) => (
            <span>
                <span style={{marginRight: 10}}>{time}回答</span>
                {text}
                <Avatar src={avatar} icon="user" className="answerAvatar" />
            </span>
            )
        const Accept = ({id, used}) => (
            showCheckbox ? (
                <Popconfirm title="确定采纳此答案吗？"
                    okText="确认"
                    cancelText="取消"
                    onConfirm={this.onConfirm}
                    onCancel={this.onCancel}>
                    <Checkbox onClick={this.acceptAnswer} data-id={id}>采纳</Checkbox>
                </Popconfirm>
                ) : null
        )
        const Answer = ({answer}) => (
            <div
                style={{color: '#000'}}
                dangerouslySetInnerHTML={{__html: answer}} />
            )
        const Question = ({question}) => (
            <span>
                <Icon type="question-circle-o" style={{color: '#1890ff', marginRight: 10}} />
                {question}
            </span>
            )
        return (
            <div className="ProblemDetail">
                <div style={{width: '80%', margin: '0 auto'}}>
                    <Card
                        title={<Question question={DetailData.title} />}
                        extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                    >
                        <p className="Problem" dangerouslySetInnerHTML={{__html: DetailData.problem}} />
                        {user && user.id === DetailData.user_id
                            ? <Button type="primary" data-id={DetailData.id} onClick={this.props.handleEdit}>编辑</Button>
                            : null}
                        <div className="msg">
                            <span>{`提问者：${DetailData.realname}`}</span>
                            <span>{`提问时间：${moment(DetailData.createdAt).format('LLL')}`}</span>
                        </div>
                        <CustomModal {...this.props.modalSetting} footer={null} onCancel={this.props.handleModalCancel} user={this.props.user}>
                            <CustomForm
                                formStyle={{width: '100%'}}
                                formFields={formFields}
                                handleSubmit={this.handleFormSubmit}
                                updateFormFields={this.props.updateFormFields}
                                formFieldsValues={this.props.formFieldsValues}
                                isSubmitting={this.props.isSubmitting}
                            />
                        </CustomModal>
                    </Card>
                    <div className="divider">
                        <h3>{`${answerList.length}个回答`}</h3>
                        <Divider />
                    </div>
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
                                extra={item.used === '1' ? (
                                    <span className="hasAccept">
                                        <Icon type="check-circle" style={{marginRight: 8, fontSize: 18}} />
                                        已采纳
                                    </span>
                                    ) : (<Accept id={item.id} used={item.used} />)}
                                actions={[<Bottom
                                    time={item.date}
                                    text={item.User.realname}
                                    avatar={answerList && item.User.avatar ? `/uploadImgs/${item.User.avatar}` : null}
                                        />]}>
                                <List.Item.Meta
                                    description={<Answer answer={item.answer} />}
                                />
                            </List.Item>
                            )} />
                    <div style={{height: 300, marginTop: 30}}>
                        <h3>撰写答案</h3>
                        <ReactQuill
                            placeholder="撰写答案"
                            style={{height: 150, color: 'black'}}
                            value={answer}
                            onChange={this.answerChange}
                        />
                        <Button type="primary" style={{float: 'right', marginTop: 50}} onClick={this.answerSubmit}>提交</Button>
                    </div>
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
    },
    customGetData: true
})

export default PE
