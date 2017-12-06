import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Modal, Input, Button } from 'antd'

const { TextArea } = Input

class PopModal extends Component {
    state = {
        text: '请输入'
    }
    onPressEnter = (e) => {
        e.preventDefault()
        const content = this.refs.content.value.trim()
        console.log(content)
        this.props.handleok(content)
    }
    render() {
        const { show, onCancel, onChange } = this.props
        return (
            <div>
                <Modal
                    title="添加日志"
                    visible={show}
                    onOk={this.onPressEnter}
                    onCancel={onCancel}>
                    <textarea ref="content" onBlur={this.onPressEnter} className="ant-input" placeholder="请输入内容" />
                </Modal>
            </div>
        )
    }
}

export default PopModal
