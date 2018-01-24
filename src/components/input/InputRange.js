import React from 'react'
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd'
const InputGroup = Input.Group
const Option = Select.Option

class InputRange extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            number1: 0.00,
            number2: 0.00
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
            <InputGroup className="mb-10" compact style={{ width: 250, marginRight: 50 }} >
                <InputNumber value={this.props.value ? this.props.value.number1 : 0.00} min={0} onChange={this.handleNumberTarget('number1')} style={{ width: 100, textAlign: 'center' }} precision={2} placeholder="Minimum" />
                <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                <InputNumber value={this.props.value ? this.props.value.number2 : 0.00} min={0} onChange={this.handleNumberTarget('number2')} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} precision={2} placeholder="Maximum" />
            </InputGroup>
        )
    }
}

export default InputRange
