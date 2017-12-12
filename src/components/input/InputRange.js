import React from 'react'
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd'
const InputGroup = Input.Group
const Option = Select.Option

class InputRange extends React.Component {
    constructor(props) {
        super(props)

        const value = this.props.value || {}
        this.state = {
            number1: value.number1 || 0,
            number2: value.number2 || 0
        }
    }
    handleNumberTarget = (t) => {
        const target = t
        return (value) => {
            const number = parseInt(value || 0)
            // if (isNaN(number)) {
            //     return
            // }
            this.setState({ [target]: value }, () => {
                this.triggerChange()
            })
        }
    }

    triggerChange = () => {
        // Should provide an event to pass value to Form.
        const onChange = this.props.onChange
        if (onChange) {
            onChange(Object.assign({}, this.state))
        }
    }
    render() {
        return (
            <InputGroup compact style={{ width: 250, marginRight: 50 }} >
                <InputNumber onChange={this.handleNumberTarget('number1')} style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                <InputNumber onChange={this.handleNumberTarget('number2')} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
            </InputGroup>
        )
    }
}

export default InputRange
