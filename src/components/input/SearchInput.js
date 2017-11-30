import React from 'react'
import { Input, AutoComplete } from 'antd'
const Option = AutoComplete.Option

function onSelect(value) {
    console.log('onSelect', value)
}

function renderOption(item, idx, arr) {
    return (
        <Option key={item} text={item}>
            {item}
        </Option>
    )
}

class SearchInput extends React.Component {
    state = {
        dataSource: []
    }

    handleSearch = (value) => {
        this.setState({
            dataSource: [
                value,
                value + 'a',
                value + 'b'
            ]
        })
    }

    render() {
        const { dataSource } = this.state
        return (
            <AutoComplete
                size="large"
                style={this.props.styles || {width: '300px'}}
                className={this.props.classNames}
                dataSource={dataSource.map(renderOption)}
                onSelect={onSelect}
                onSearch={this.handleSearch}
            >
                <Input.Search
                    placeholder="请输入"
                    onSearch={value => console.log(value)}
                />
            </AutoComplete>
        )
    }
}

export default SearchInput
