/**
 * 日志弹框
 */
import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Modal, Input, Button, Menu, Dropdown, Icon } from 'antd'
import 'ROUTES/Personal/WorkLog.less'

const { TextArea } = Input
class PopModal extends Component {
    state = {
        text: '请输入',
        showTip: false,
        textContent: ''
    }

    onChange = (e) => {
        this.setState({
            textContent: e.target.value
        })
    }

    onSubmit = (e) => {
        this.props.handleok(this.state.textContent)
    }

    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.props.delete}>删除日志</span>
                </Menu.Item>
            </Menu>
        )
        const { textContent } = this.state
        const { show, onCancel, onChange, title, showTip, showDelete } = this.props
        return (
            <div>
                <Modal
                    title={title}
                    visible={show}
                    onOk={this.onSubmit}
                    onCancel={onCancel}>
                    {showTip === true ? <p style={{color: 'red'}}>请输入日志！</p> : null}
                    <TextArea
                        value={textContent}
                        onChange={this.onChange}
                        onPressEnter={this.onSubmit}
                        placeholder="请输入日志内容"
                        rows={4}
                        className="inline" />
                    {showDelete === true ? <Dropdown overlay={menu} className="inline">
                        <Icon type="down" />
                    </Dropdown> : null
                    }
                </Modal>
            </div>
        )
    }
}

export default PopModal
