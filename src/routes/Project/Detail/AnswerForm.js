import React, {Component} from 'react'
import {
    Modal
} from 'antd'
import {
    Link,
    Route,
    Switch,
    Redirect
} from 'react-router-dom'

import 'STYLE/css/theme.less'
import cs from 'classnames'
import ReactQuill from 'react-quill'

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
        const { show, onCancel, title, editAnswer, handleok, editChange, user } = this.props
        const Class = cs({
            [`${user && user.skin}`]: true,
            [`${user && user.font_size}`]: true
        })
        return (
            <Modal
                title={`${title}`}
                visible={show}
                onOk={handleok}
                onCancel={onCancel}
                className={Class}>
                <div
                    style={{height: 250}}>
                    <ReactQuill
                        placeholder="内容" style={{height: 200}}
                        value={editAnswer}
                        onChange={editChange} />
                </div>
            </Modal>
        )
    }
}

export default AnswerEdit
