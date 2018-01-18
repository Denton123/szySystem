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
    Modal,
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
import {ajax, show, store, index, update, destroy} from 'UTILS/ajax'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'
import CustomDatePicker from 'COMPONENTS/date/CustomDatePicker'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

import AnswerEdit from './AnswerForm.js'

import './ProblemDetail.less'
const {Meta} = Card
const confirm = Modal.confirm

// 去除字符串换行和空格
function replaceBlank(str) {
    return str.replace(/\s/g, '').replace(/<\/?.+?>/g, '')
}
// 去除html标签
function removeHtml(str) {
    return str.replace(/<\/?.+?>/g, '').replace(/ /g, '')
}
class ProblemDetail extends Component {
    state = {
        DetailData: {}, // 问题数据
        answer: '', // 答案value值
        answerList: [], // 当前页答案数据
        loading: true, // List的加载
        loadingMore: false,
        showLoadingMore: false, // 加载更多
        showCheckbox: false, // 采纳框是否显示
        flag: 1, // 当前页数
        allData: [], // 全部答案数据
        show: false, // 是否弹出模态框
        title: '', // 编辑表单标题
        editContent: '', // 编辑内容
        editID: '', // 编辑ID
        quillShow: true, // 答案编辑器显示,
    }
    componentDidMount() {
        this.getProblemData()
    }
    // 返回上一页
    goBack = () => {
        this.props.history.go(-1)
    }
    // 获取问题数据
    getProblemData = () => {
        let id = this.props.match.params.id
        const hide = message.loading('数据读取中', 0)
        show(`problem/${id}`).then(res => {
            setTimeout(hide, 0)
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
    // 获取当前页答案
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
            const answerList = this.state.answerList
            const hasArr = []
            if (answerList) {
                for (let d in answerList) {
                    hasArr.push(answerList[d].user_id)
                }
            }
            console.log(hasArr)
            if (hasArr.indexOf(this.props.user.id) !== -1) {
                this.setState({
                    quillShow: false
                })
            } else {
                this.setState({
                    quillShow: true
                })
            }
            if (answerList.length === 0) {
                this.setState({
                    quillShow: true
                })
            }
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
    // 获取答案数据公共方法
    getAnswerData = (page, callback) => {
        let showId = this.state.DetailData.id
        show(`/answer/${showId}?page=${page}`).then(res => {
            res.data.data.forEach((t) => {
                t.date = moment(t.date).startOf('second').fromNow()
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
    // 加载更多
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
    // 答案提交
    answerSubmit = () => {
        if (removeHtml(this.state.answer) !== '') {
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
    // 采纳答案
    acceptAnswer = (e) => {
        const changeId = e.target.dataset['id']
        const id = this.state.DetailData.id
        confirm({
            title: '确认采纳该答案吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                const used = {
                    ansId: changeId,
                    proId: id
                }
                ajax('post', `/answer/answerupdate`, used).then(res => {
                    this.getData()
                })
            }
        })
    }
    // 问题编辑
    handleFormSubmit = (values) => {
        this.props.handleFormSubmit(values)
        this.getProblemData()
    }
    // 答案编辑
    editAnswer = (e) => {
        const editId = e.target.dataset.id
        const answerList = this.state.answerList
        this.setState({
            show: true,
            title: '答案编辑',
            editID: editId
        })
        for (let i in answerList) {
            if (Number(editId) === answerList[i].id) {
                this.setState({
                    editContent: answerList[i].answer
                })
            }
        }
    }
    editChange = (e) => {
        // this.setState({
        //     test: e
        // })
        localStorage.setItem('editText', e)
    }
    // 提交答案编辑
    handleok = (e) => {
        this.setState({
            show: false
        })
        const answer = localStorage.getItem('editText')
        const changeId = this.state.editID
        const editText = {
            answer: answer
        }
        update(`/answer/${changeId}`, editText).then(res => {
            res.status === 200 ? message.success('保存成功') : message.success('保存失败')
            this.getProblemData()
        })
    }
    // 取消答案编辑
    onCancel = (e) => {
        this.setState({
            show: false
        })
    }
    // 删除答案
    deleteAnswer = (e) => {
        const deleteId = e.target.dataset.id
        confirm({
            title: '确定要删除答案吗?',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                destroy(`/answer/${deleteId}`).then(res => {
                    this.getData()
                })
            },
            onCancel: () => {
                console.log('Cancel')
            }
        })
    }
    render() {
        const {DetailData, answer, answerList, showLoadingMore, loading,
            loadingMore, showCheckbox, show, title, editAnswer, editContent, onCancel, quillShow} = this.state
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
                    return getFieldDecorator('title', {
                        rules: [{required: true, message: '请输入标题'}]
                    })(<Input autoComplete="off" placeholder="请输入标题" />)
                },
            },
            {
                label: '内容',
                formItemStyle: {
                    height: 350
                },
                content: ({getFieldDecorator}) => {
                    return getFieldDecorator('problem', {
                        rules: [{required: true, message: '请输入内容'}]
                    })(<ReactQuill placeholder="内容" style={{height: 250}} />)
                },
            }
        ]
        const loadMore = showLoadingMore ? (
            <div style={{textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px'}}>
                {loadingMore && <Spin />}
                {!loadingMore && <Button onClick={this.onLoadMore}>查看更多回答</Button>}
            </div>
            ) : null

        const Bottom = ({time, userId, id, used}) => (
            <span>
                <span>{time}回答</span>
                {
                    user && user.id === userId && used === '0' ? (
                        <span className="answerOperate">
                            <a data-id={id} onClick={this.editAnswer}>编辑</a>
                            <a data-id={id} onClick={this.deleteAnswer}>删除</a>
                        </span>
                    ) : null
                }
                <AnswerEdit
                    show={show}
                    title={title}
                    handleok={this.handleok}
                    onCancel={this.onCancel}
                    editAnswer={editContent}
                    editChange={this.editChange}
                    user={this.props.user} />
            </span>
            )
        const Accept = ({id, userId}) => (
            userId !== DetailData.user_id && showCheckbox ? (
                <Checkbox onClick={this.acceptAnswer} data-id={id}>采纳</Checkbox>
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
                                    ) : (<Accept id={item.id} userId={item.user_id} />)}
                                actions={[<Bottom
                                    time={item.date}
                                    userId={item.user_id}
                                    id={item.id}
                                    used={item.used}
                                        />]}>
                                <span>{item.User.realname}</span>
                                <Avatar src={answerList && item.User.avatar ? `/uploadImgs/${item.User.avatar}` : null} icon="user" className="answerAvatar" />
                                <List.Item.Meta
                                    description={<Answer answer={item.answer} />}
                                />
                            </List.Item>
                            )} />
                    {
                        quillShow ? (
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
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

const PE = withBasicDataModel(ProblemDetail, {
    model: 'problem',
    title: '问题',
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
