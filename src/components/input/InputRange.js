import React from 'react'
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader } from 'antd'
const InputGroup = Input.Group
const Option = Select.Option

class InputRange extends React.Component {
    render() {
        return (
            <InputGroup compact>
                <Select defaultValue="1">
                    <Option value="1">Between</Option>
                    <Option value="2">Except</Option>
                </Select>
                <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                <Input style={{ width: 24, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
            </InputGroup>
        )
    }
}

export default InputRange
