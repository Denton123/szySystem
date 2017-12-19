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
import {ajax, show, answerUpdate, store, index, update} from 'UTILS/ajax'

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

class ProblemDetail extends Component {
    state = {
        DetailData: [],
        answer: '',
        answerList: [],
        loading: true,
        loadingMore: false,
        showLoadingMore: true,
        flag: '',
        showCheckbox: false
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
        }).then(() => {
            let showId = this.state.DetailData.id
            show(`/answer/${showId}`).then(res => {
                res.data.forEach((t) => {
                    t.date = t.date.substr(0, 10)
                })
                this.setState({
                    answerList: res.data
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
                } else if (arr.indexOf('1') !== -1 && userid === detailArr.user_id) {
                    this.setState({
                        showCheckbox: false
                    })
                }
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
            <div dangerouslySetInnerHTML={{__html: answer}} />
            )
        return (
            <div style={{padding: 24, background: '#fff', height: '100%'}}>
                <div style={{width: '80%', margin: '0 auto'}}>
                    <Card
                        title={DetailData.title}
                        extra={<Button type="primary" onClick={this.goBack}>返回</Button>}
                    >
                        <p className="Problem" dangerouslySetInnerHTML={{__html: DetailData.problem}} />
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
                                handleSubmit={this.handleFormSubmit}
                                updateFormFields={this.props.updateFormFields}
                                formFieldsValues={this.props.formFieldsValues}
                                isSubmitting={this.props.isSubmitting}
                            />
                        </CustomModal>
                    </Card>
                    <Divider />
                    <h3>{`${answerList.length}个回答`}</h3>
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
                                extra={item.used === '1' ? (
                                    <span><Icon type="check-circle" />已采纳</span>
                                    ) : (<Accept id={item.id} used={item.used} />)}
                                actions={[<Bottom
                                    time={item.date}
                                    text={item.User.realname}
                                    avatar={`/uploadImgs/${item.User.avatar}`}
                                        />]}>
                                <List.Item.Meta
                                    description={<Answer answer={item.answer} />}
                                />
                            </List.Item>
                            )} />
                    <Divider />
                    <h3>撰写答案</h3>
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
