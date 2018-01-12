import React, {Component} from 'react'
import {
    Input,
    Button,
    Divider,
    Table,
    List,
    Form,
    Modal,
    message
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import {resetObject} from 'UTILS/utils'
import {ajax} from 'UTILS/ajax'
import {checkFormField} from 'UTILS/regExp'

import BasicOperation from 'COMPONENTS/basic/BasicOperation'
import ReactQuill from 'react-quill'

import CustomModal from 'COMPONENTS/modal/CustomModal'
import CustomForm from 'COMPONENTS/form/CustomForm'

import withBasicDataModel from 'COMPONENTS/hoc/withBasicDataModel'

const FormItem = Form.Item

class AnswerEdit extends Component {
    state = {
    }
    componentDidMount() {
    }
    render() {
        const {
            history,
            location,
            match,
            route
        } = this.props
        const { show, onCancel, title, showDelete, editAnswer, answerEdit, handleok, Edit } = this.props
        return (
            <Modal
                title={`${title}`}
                visible={show}
                onOk={handleok}
                onCancel={onCancel}>
                <div
                    style={{height: 250}}>
                    <ReactQuill
                        placeholder="内容" style={{height: 200}}
                        value={editAnswer}
                        onChange={Edit} />
                </div>
            </Modal>
        )
    }
}

export default AnswerEdit
