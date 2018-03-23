import React from 'react'
import { createForm } from 'rc-form'

import { List, Button, Toast, WhiteSpace } from 'antd-mobile'

class CustomForm extends React.Component {
    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
                console.log('使用this.props.handleSubmit方法提交表单信息', this.props.form.getFieldsValue())
                this.props.handleSubmit(this.props.form.getFieldsValue())
            } else {
                let errs = this.props.form.getFieldsError()
                Toast.info(
                    Object.keys(errs).map(err => {
                        if (errs[err]) {
                            return this.props.form.getFieldsError()[err][0]
                        } else {
                            return ''
                        }
                    }).filter(msg => {
                        return msg.length > 0
                    }).join(','),
                    1
                )
            }
        })
    }
    onReset = () => {
        this.props.form.resetFields()
        this.props.handleReset()
    }
    render() {
        const {
            formFields, // 表单单个作用域 类型 Array
            hasFormOperation, // 是否要表单操作 类型 Boolean 默认true
        } = this.props
        const HasFormOperation = hasFormOperation === false ? false : true
        return (
            <form>
                <List>
                    {formFields.map((formField, idx) => (
                        <div key={idx}>{formField(this.props.form)}</div>
                    ))}
                    {HasFormOperation ? (
                        <List.Item>
                            <Button type="primary" size="small" onClick={this.onSubmit}>提交</Button>
                            <WhiteSpace />
                            <Button size="small" onClick={this.onReset}>重置</Button>
                        </List.Item>
                    ) : null}
                </List>
            </form>
        )
    }
}

export default createForm({
    // onFieldsChange: function(props, values) {
    //     props.updateFormFields(values)
    // },
    // // 把父组件的属性映射到表单项上
    // mapPropsToFields(props) {
    //     let obj = {}
    //     for (let i in props.formFieldsValues) {
    //         obj[i] = Form.createFormField({
    //             ...props.formFieldsValues[i],
    //             value: props.formFieldsValues[i].value
    //         })
    //     }
    //     return obj
    // }
})(CustomForm)
