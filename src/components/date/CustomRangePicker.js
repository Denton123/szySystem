import React from 'react'
import { DatePicker } from 'antd'
const { RangePicker } = DatePicker

class CustomRangePicker extends React.Component {
    render() {
        const props = {}
        for (let i in this.props) {
            props[i] = this.props[i]
        }
        let defaultPropsArr = [
            {
                prop: 'format',
                value: 'YYYY-MM-DD HH:mm'
            },
            {
                prop: 'placeholder',
                value: ['开始时间', '结束时间']
            },
            {
                prop: 'showTime',
                value: { format: 'HH:mm' }
            }
        ]
        defaultPropsArr.forEach(item => {
            if (!Object.keys(props).includes(item.prop)) {
                props[item.prop] = item.value
            }
        })
        return (
            <RangePicker {...props} />
        )
    }
}

export default CustomRangePicker
