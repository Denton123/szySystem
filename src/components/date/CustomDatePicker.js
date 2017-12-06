import React from 'react'
import { DatePicker } from 'antd'

class CustomDatePicker extends React.Component {
    render() {
        // const {
        //     style,        // 样式
        //     size,         // 大小
        //     showTime,     // 是否显示时间 boolean
        //     format,       // 时间格式
        //     placeholder,  // 默认文本
        //     open,         // 控制弹层是否展开，在两个独立的日期选择时需要使用到，如果不需要使用建议不要添加open属性
        //     value,        // 绑定的值
        //     disabledDate, // 不能选择的日期 function
        //     onChange,     // 值变化 function
        //     onOpenChange  // 打开和关闭弹层时的回调 function
        // } = this.props.setting
        const props = {}
        for (let i in this.props) {
            props[i] = this.props[i]
        }
        // 部分默认属性
        let defaultPropsArr = [
            {
                prop: 'format',
                value: 'YYYY-MM-DD HH:mm'
            },
            {
                prop: 'placeholder',
                value: '请选择时间'
            },
            {
                prop: 'showTime',
                value: true
            }
        ]
        defaultPropsArr.forEach(item => {
            if (!Object.keys(props).includes(item.prop)) {
                props[item.prop] = item.value
            }
        })
        return (
            <DatePicker {...props} />
        )
    }
}

export default CustomDatePicker
