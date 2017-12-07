import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Modal, Input, Button } from 'antd'

const { TextArea } = Input

class PopModal extends Component {
    state = {
        text: '请输入',
        showTip: false
    }
    onPressEnter = (e) => {
        e.preventDefault()
        const content = this.refs.content.value.trim()
        // console.log(content)
        if (content === '') {
            this.setState({
                showTip: !this.state.showTip
            })
        }
        this.props.handleok(content)
        console.log(this.state.showTip + '====出现')
    }

    componentDidMount() {
        console.log(this.state.showTip + '====在出现')
    }
    componentWillUnmount() {
        console.log(this.state.showTip + '====不在出现')
    }
    render() {
        const { show, onCancel, onChange, title } = this.props
        return (
            <div>
                <Modal
                    title={title}
                    visible={show}
                    onOk={this.onPressEnter}
                    onCancel={onCancel}>
                    {this.state.showTip === true ? <p style={{color: 'red'}}>请输入日志！</p> : null}
                    <textarea ref="content" onBlur={this.onPressEnter} className="ant-input" placeholder="请输入内容" />
                </Modal>
            </div>
        )
    }
}

export default PopModal
