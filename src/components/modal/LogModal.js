/**
 * 日志弹框
 */
import ReactDOM from 'react-dom'
import React, {Component} from 'react'
import { Modal, Input, Button, Menu, Dropdown, Icon } from 'antd'
import 'ROUTES/Personal/WorkLog.less'
import 'STYLE/css/theme.less'
import cs from 'classnames'

const { TextArea } = Input
class PopModal extends Component {
    state = {
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
    componentWillReceiveProps(nextProps) {
        const logcontent = nextProps.logcont.trim()
        this.setState({
            textContent: logcontent
        })
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
        const user = this.props.user
        const Class = cs({
            [`${user && user.skin}`]: true,
            [`${user && user.font_size}`]: true
        })
        return (
            <div>
                <Modal
                    title={`${title}日志`}
                    visible={show}
                    onOk={this.onSubmit}
                    onCancel={onCancel}
                    className={Class}>
                    {showTip === true ? <p style={{color: 'red'}}>请输入日志！</p> : null}
                    <div className="wrap">
                        <TextArea
                            value={textContent}
                            onChange={this.onChange}
                            onPressEnter={this.onSubmit}
                            placeholder="请输入日志内容"
                            rows={4}
                            className="text" />
                        {showDelete === true ? <Dropdown overlay={menu}>
                            <Icon type="down-circle-o" className="icon" />
                        </Dropdown> : null
                        }
                    </div>
                </Modal>
            </div>
        )
    }
}

export default PopModal
