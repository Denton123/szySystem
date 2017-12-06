import React from 'react'
import { Form } from 'antd'

const FormItem = Form.Item

class CustomForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        // options.first    若为 true，则每一表单域的都会在碰到第一个失败了的校验规则后停止校验    boolean false
        // options.firstFields  指定表单域会在碰到第一个失败了的校验规则后停止校验   String[]    []
        // options.force    对已经校验过的表单域，在 validateTrigger 再次被触发时是否再次校验   boolean false
        // options.scroll   定义 validateFieldsAndScroll 的滚动行为，详细配置见 dom-scroll-into-view config  Object  {}
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values)
                this.props.handleSubmit(values)
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        const {formFields} = this.props
        const formItemLayout = this.props.customFormItemLayout
            ? this.props.customFormItemLayout
            : {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 8 }
                }
            }
        return (
            <Form onSubmit={this.handleSubmit}>
                {formFields.map((item, idx) => (
                    <FormItem key={idx} label={item.label ? item.label : ''} {...formItemLayout}>
                        {item.field && item.valid ? getFieldDecorator(item.field, item.valid)(item.component) : item.component}
                    </FormItem>
                ))}
            </Form>
        )
    }
}

export default Form.create({
    // 当 Form.Item 子节点的值发生改变时触发
    onFieldsChange: function(props, values) {
        props.updateFormFields(values)
    },

    // 把父组件的属性映射到表单项上
    mapPropsToFields(props) {
        let obj = {}
        for (let i in props.formFieldsValues) {
            obj[i] = {
                ...props.formFieldsValues[i],
                value: props.formFieldsValues[i].value
            }
        }
        return obj
    }
})(CustomForm)
