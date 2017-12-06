import React from 'react'
import { Form, Button } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
/**
 * props属性(存在*的属性，在父组件是必须传值)
 * handleSubmit          {function} 提交表单的方法           *
 * formFields            {array}    表单字段数组             *
 * updateFormFields      {function} 更新表单字段时的方法     *
 * formFieldsValues      {object}   表单全部字段的值         *
 * customFormItemLayout  {object}   表单行的布局
 * layout                {string}   表单布局方式             默认'horizontal'    'horizontal'|'vertical'|'inline'
 * formStyle             {object}   表单样式
 * customFormOperation   {string}   表单的提交时的文本
 * isSubmitting          {boolean}  表单提交按钮loading状态  *
 */
class CustomForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
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
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                }
            }
        const layout = this.props.layout ? this.props.layout : 'horizontal'
        const formStyle = this.props.formStyle ? this.props.formStyle : {width: 300}
        return (
            <Form onSubmit={this.handleSubmit} layout={layout} style={formStyle}>
                {formFields.map((item, idx) => (
                    <FormItem key={idx} label={item.label ? item.label : ''} {...formItemLayout}>
                        {item.field
                            ? getFieldDecorator(item.field, item.valid ? item.valid : {})(item.component)
                            : item.component
                        }
                    </FormItem>
                ))}
                <FormItem wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 8 },
                }}>
                    <Button type="primary" htmlType="submit" loading={this.props.isSubmitting}>
                        {this.props.customFormOperation ? this.props.customFormOperation : '保存'}
                    </Button>
                </FormItem>
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
            obj[i] = Form.createFormField({
                ...props.formFieldsValues[i],
                value: props.formFieldsValues[i].value
            })
        }
        return obj
    }
})(CustomForm)
