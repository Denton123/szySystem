import React from 'react'
import { Input, Select } from 'antd'

const InputGroup = Input.Group
const Option = Select.Option

class SearchInput extends React.Component {
    handleSearchTypeChange = (value) => {
        this.props.handleSearchTypeChange(value)
    }

    handleInputChange = (e) => {
        const {value} = e.target
        this.props.handleInputChange(value)
    }

    render() {
        const props = this.props
        return (
            <div className="inline-block" style={{verticalAlign: 'middle'}}>
                <InputGroup compact>
                    <Select defaultValue={props.queryField} onChange={this.handleSearchTypeChange}>
                        <Option value="realname">姓名</Option>
                        <Option value="email">邮箱</Option>
                        <Option value="job">职位</Option>
                    </Select>
                    <Input
                        style={{ width: 200 }}
                        value={props.queryFieldValue}
                        placeholder="请输入"
                        onChange={this.handleInputChange}
                    />
                </InputGroup>
            </div>
        )
    }
}

export default SearchInput
